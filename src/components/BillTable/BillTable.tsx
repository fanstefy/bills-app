import { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { Bill } from '../../types/bill';
import BillModal from '../BillModal';
import SearchInput from '../SearchInput';
import { motion } from 'framer-motion';

interface BillTableProps {
  bills: Bill[];
  loading: boolean;
  error: string | null;
}

const BillTable: React.FC<BillTableProps> = ({ bills, loading, error }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredBills = useMemo(() => {
    let billsToFilter = bills;

    if (tabValue === 1) {
      billsToFilter = bills.filter((bill) =>
        favorites.includes(Number(bill.billNo))
      );
    }

    if (!searchQuery.trim()) return billsToFilter;

    const query = searchQuery.toLowerCase();
    return billsToFilter.filter(
      (bill) =>
        bill.billType.toLowerCase().includes(query) ||
        bill.billNo.toString().includes(query)
    );
  }, [searchQuery, bills, tabValue, favorites]);

  const handleRowClick = (bill: Bill) => {
    setSelectedBill(bill);
  };

  const handleCloseModal = () => {
    setSelectedBill(null);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const toggleFavorite = (billNo: number) => {
    setFavorites((prev) =>
      prev.includes(billNo)
        ? prev.filter((id) => id !== billNo)
        : [...prev, billNo]
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'white',
          p: 1,
        }}
      >
        <SearchInput onSearch={handleSearch} />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="All Bills" />
          <Tab label="Favourite Bills" />
        </Tabs>
      </Box>

      <TableContainer component={Paper} sx={{ overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bill Number</TableCell>
              <TableCell>Bill Type</TableCell>
              <TableCell>Bill Status</TableCell>
              <TableCell>Sponsor</TableCell>
              <TableCell>Favourite</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No value for this input
                </TableCell>
              </TableRow>
            ) : (
              filteredBills.map((bill, index) => (
                <motion.tr
                  key={`${index}-${bill.billNo}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  whileHover={{ backgroundColor: '#d3c9c9de' }}
                  onClick={() => handleRowClick(bill)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{bill.billNo}</TableCell>
                  <TableCell>{bill.billType}</TableCell>
                  <TableCell>{bill.billStatus}</TableCell>
                  <TableCell>{bill.sponsor}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      onClick={() => toggleFavorite(Number(bill.billNo))}
                      aria-label="add to favorites"
                      disableRipple
                      disableFocusRipple
                      sx={{
                        '&:focus': {
                          outline: 'none',
                        },
                      }}
                    >
                      {favorites.includes(Number(bill.billNo)) ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedBill && (
        <BillModal bill={selectedBill} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default BillTable;
