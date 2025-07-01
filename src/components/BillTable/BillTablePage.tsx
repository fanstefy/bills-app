import { useState, useCallback } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useBills } from '../../hooks/useBills';
import type { Bill } from '../../types/bill';
import SearchInput from './SearchInput';
import BillTable from './BillTable';
import BillModal from '../BillModal';

const BillTablePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [favorites, setFavorites] = useState<Map<string, Bill>>(new Map());
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const { bills, totalCount, loading, error } = useBills(
    currentPage,
    rowsPerPage,
    searchQuery
  );
  console.log('stefan bills: ', bills);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const toggleFavorite = useCallback((bill: Bill) => {
    setFavorites((prev) => {
      const newFavs = new Map(prev);
      if (newFavs.has(bill.id)) {
        newFavs.delete(bill.id);
      } else {
        newFavs.set(bill.id, bill);
      }
      return newFavs;
    });
  }, []);

  const isFavorite = useCallback(
    (billId: string) => favorites.has(billId),
    [favorites]
  );

  const handleRowClick = (bill: Bill) => {
    setSelectedBill(bill);
  };

  const handleCloseModal = () => {
    setSelectedBill(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  // Filter bills based on tab and search query
  const filteredBills =
    tabValue === 1
      ? Array.from(favorites.values()).filter(
          (bill) =>
            bill.billType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.sponsor.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : bills.filter(
          (bill) =>
            bill.billType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.sponsor.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <>
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
          value={tabValue}
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

      <Box
        sx={{
          height: 'calc(100vh - 90px)',
          overflowY: 'auto',
          backgroundColor: 'transparent',
        }}
      >
        <BillTable
          bills={filteredBills}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          onRowClick={handleRowClick}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          onPageChange={handleChangePage}
          showPagination={tabValue === 0}
          loading={loading}
          tabValue={tabValue}
          searchQuery={searchQuery}
        />
      </Box>

      {selectedBill && (
        <BillModal bill={selectedBill} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default BillTablePage;
