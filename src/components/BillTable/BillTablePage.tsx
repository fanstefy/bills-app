import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { useBillsReactQuery } from '../../hooks/useBills';
import type { Bill } from '../../types/bill';
import SearchInput from './SearchInput';
import BillTable from './BillTable';
import BillModal from '../BillModal';

// Constants
const ROWS_PER_PAGE = 10;
const TABS = {
  ALL_BILLS: '0',
  FAVORITES: '1',
} as const;

const BillTablePage: React.FC = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>(TABS.ALL_BILLS);
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
  const favoritesList = Array.from(favorites.values());

  // Event handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
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
    <TabContext value={activeTab}>
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
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root:focus': {
              outline: 'none',
            },
          }}
        >
          <Tab
            label="Bills"
            value={TABS.ALL_BILLS}
            sx={{
              borderBottom:
                activeTab === TABS.ALL_BILLS ? '1px solid #1976d2' : 'none',
              transition: 'border-bottom 0.2s',
            }}
          />
          <Tab
            label="Favourite Bills"
            value={TABS.FAVORITES}
            sx={{
              borderBottom:
                activeTab === TABS.FAVORITES ? '1px solid #1976d2' : 'none',
              transition: 'border-bottom 0.2s',
            }}
          />
        </Tabs>
      </Box>

      {/* Main content with TabPanels */}
      <Box
        sx={{
          height: 'calc(100vh - 90px)',
          overflowY: 'auto',
          backgroundColor: 'transparent',
        }}
      >
        <TabPanel value={TABS.ALL_BILLS} sx={{ padding: 0 }}>
          <BillTable
            bills={bills}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            onRowClick={handleRowClick}
            currentPage={currentPage}
            rowsPerPage={ROWS_PER_PAGE}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            showPagination={true}
            loading={isLoading}
            tabValue={0}
            searchQuery={searchQuery}
          />
        </TabPanel>

        <TabPanel value={TABS.FAVORITES} sx={{ padding: 0 }}>
          <BillTable
            bills={favoritesList}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            onRowClick={handleRowClick}
            currentPage={0}
            rowsPerPage={ROWS_PER_PAGE}
            totalCount={favoritesList.length}
            onPageChange={() => {}} // No pagination for favorites
            showPagination={false}
            loading={false}
            tabValue={1}
            searchQuery={searchQuery}
          />
        </TabPanel>
      </Box>

      {/* Modal */}
      {selectedBill && (
        <BillModal bill={selectedBill} onClose={handleCloseModal} />
      )}
    </TabContext>
  );
};

export default BillTablePage;
