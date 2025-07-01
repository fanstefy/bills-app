import { useEffect, useRef, useState } from 'react';
import { fetchBills } from '../services/api';
import type { Bill, BillApiResponse } from '../types/bill';

const mapBills = (data: BillApiResponse): Bill[] => {
  return data.results.map((item, index) => ({
    id: `${item.bill.billNo}-${index}`,
    billNo: item.bill.billNo,
    billType: item.bill.billType,
    billStatus: item.bill.status,
    sponsor: item.bill.sponsors
      ? item.bill.sponsors
          .map((s) => s.sponsor.as?.showAs)
          .filter(Boolean)
          .join(', ')
      : 'Unknown',
    title_en: item.bill.shortTitleEn,
    title_ga: item.bill.shortTitleGa,
  }));
};

export const useBills = (
  currentPage: number,
  rowsPerPage: number,
  searchQuery: string
) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Added cache for search results
  const searchCache = useRef<Bill[] | null>(null);
  console.log('searchCache: ', searchCache);

  useEffect(() => {
    const loadBills = async () => {
      setLoading(true);
      try {
        let mapped: Bill[] = [];
        if (searchQuery.trim() === '') {
          // Standard pagination
          searchCache.current = null; // reset cache
          const skip = currentPage * rowsPerPage;
          const data = await fetchBills(rowsPerPage, skip);
          mapped = mapBills(data);
          setBills(mapped);
          setTotalCount(data.head.counts.billCount);
        } else {
          // Use cache if exists
          if (!searchCache.current) {
            const data = await fetchBills(200, 0);
            searchCache.current = mapBills(data);
          }
          const query = searchQuery.toLowerCase();
          const filtered = searchCache.current.filter(
            (bill) =>
              bill.billType.toLowerCase().includes(query) ||
              bill.billNo.toLowerCase().includes(query)
          );
          setTotalCount(filtered.length);
          if (filtered.length < rowsPerPage) {
            setBills(filtered);
          } else {
            const start = currentPage * rowsPerPage;
            setBills(filtered.slice(start, start + rowsPerPage));
          }
        }
      } catch (err) {
        setError('Failed to load bills');
      } finally {
        setLoading(false);
      }
    };

    loadBills();
  }, [currentPage, rowsPerPage, searchQuery]);

  return { bills, totalCount, loading, error };
};
