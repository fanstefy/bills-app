import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useBillsReactQuery } from '../../hooks/useBills';
import type { Bill } from '../../types/bill';
import SearchInput from './SearchInput';
import BillTable from './BillTable';
import BillModal from '../BillModal';

// Constants
const ROWS_PER_PAGE = 10;
const TABS = {
  ALL_BILLS: 0,
  FAVORITES: 1,
} as const;

const BillTablePage: React.FC = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<number>(TABS.ALL_BILLS);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [favorites, setFavorites] = useState<Map<string, Bill>>(new Map());
  const [currentPage, setCurrentPage] = useState(0);

  // Reset page when search or tab changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, activeTab]);

  // Data fetching
  const { data, isLoading, error } = useBillsReactQuery(
    currentPage,
    ROWS_PER_PAGE,
    searchQuery
  );

  const bills = data?.results ?? [];
  const totalCount = data?.totalCount ?? 0;

  // Computed values
  const isShowingFavorites = activeTab === TABS.FAVORITES;
  const displayedBills = isShowingFavorites
    ? Array.from(favorites.values())
    : bills;
  const displayedTotalCount = isShowingFavorites
    ? displayedBills.length
    : totalCount;

  // Event handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRowClick = (bill: Bill) => {
    setSelectedBill(bill);
  };

  const handleCloseModal = () => {
    setSelectedBill(null);
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const toggleFavorite = (bill: Bill) => {
    setFavorites((prev) => {
      const updated = new Map(prev);
      if (updated.has(bill.id)) {
        updated.delete(bill.id);
      } else {
        console.log('Add to favorites (request sent to server)');
        updated.set(bill.id, bill);
      }
      return updated;
    });
  };

  const isFavorite = (billId: string) => favorites.has(billId);

  // Error handling
  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error instanceof Error ? error.message : String(error)}
      </Typography>
    );
  }

  return (
    <>
      {/* Header with search and tabs */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'white',
          p: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <SearchInput onSearch={handleSearch} />
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{
            border: 'none',
            '& .MuiTabs-indicator': { display: 'none' },
          }}
        >
          <Tab label="Bills" />
          <Tab label="Favourite Bills" />
        </Tabs>
      </Box>

      {/* Main content  */}
      <Box
        sx={{
          height: 'calc(100vh - 90px)',
          overflowY: 'auto',
          backgroundColor: 'transparent',
        }}
      >
        <BillTable
          bills={displayedBills}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          onRowClick={handleRowClick}
          currentPage={currentPage}
          rowsPerPage={ROWS_PER_PAGE}
          totalCount={displayedTotalCount}
          onPageChange={handlePageChange}
          showPagination={!isShowingFavorites}
          loading={isLoading}
          tabValue={activeTab}
          searchQuery={searchQuery}
        />
      </Box>

      {/* Modal */}
      {selectedBill && (
        <BillModal bill={selectedBill} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default BillTablePage;
