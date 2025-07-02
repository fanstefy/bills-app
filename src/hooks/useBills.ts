import { fetchBills } from '../services/api';
import type { Bill } from '../types/bill';
import { useQuery } from '@tanstack/react-query';
import { transformBillData } from '../utils/billTransformers';

// Constants
const SEARCH_FETCH_LIMIT = 200;

// Filter bills based on search query
const filterBills = (bills: Bill[], searchQuery: string): Bill[] => {
  if (!searchQuery.trim()) return bills;

  const query = searchQuery.toLowerCase();
  return bills.filter(
    (bill) =>
      bill.billType.toLowerCase().includes(query) ||
      bill.billNo.toLowerCase().includes(query) ||
      bill.sponsor.toLowerCase().includes(query)
  );
};

// Paginate bills array
const paginateBills = (
  bills: Bill[],
  currentPage: number,
  rowsPerPage: number
): Bill[] => {
  const startIndex = currentPage * rowsPerPage;
  return bills.slice(startIndex, startIndex + rowsPerPage);
};

// Strategy for fetching bills without search (server-side pagination)
const fetchPaginatedBills = async (
  currentPage: number,
  rowsPerPage: number
) => {
  const skip = currentPage * rowsPerPage;
  const apiResponse = await fetchBills(rowsPerPage, skip);
  const transformedBills = transformBillData(apiResponse);

  return {
    results: transformedBills,
    totalCount: apiResponse.head.counts.billCount,
  };
};

// Strategy for fetching bills with search (client-side filtering)
const fetchSearchResults = async (
  searchQuery: string,
  currentPage: number,
  rowsPerPage: number
) => {
  const apiResponse = await fetchBills(SEARCH_FETCH_LIMIT, 0);
  const allBills = transformBillData(apiResponse);
  const filteredBills = filterBills(allBills, searchQuery);
  const paginatedBills = paginateBills(filteredBills, currentPage, rowsPerPage);

  return {
    results: paginatedBills,
    totalCount: filteredBills.length,
  };
};

export const useBillsReactQuery = (
  currentPage: number,
  rowsPerPage: number,
  searchQuery: string
) => {
  const isSearching = Boolean(searchQuery.trim());

  return useQuery({
    queryKey: ['bills', currentPage, rowsPerPage, searchQuery],
    queryFn: () => {
      return isSearching
        ? fetchSearchResults(searchQuery, currentPage, rowsPerPage)
        : fetchPaginatedBills(currentPage, rowsPerPage);
    },
    gcTime: 1000 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
