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
  Tooltip,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { Bill } from '../../types/bill';
import BillModal from '../BillModal';
import SearchInput from '../SearchInput';
import { motion } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';

interface BillTableProps {
  bills: Bill[];
  loading: boolean;
  error: string | null;
}

const BillTable: React.FC<BillTableProps> = ({ bills, loading, error }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  // Using Set sa bill.id insted of bill.billNo because of duplicates
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredBills = useMemo(() => {
    let billsToFilter = bills;

    if (tabValue === 1) {
      // Return only favorite bills
      return bills.filter((bill) => favorites.has(bill.id));
    }

    // Filtering by search query
    if (!searchQuery.trim()) return billsToFilter;

    const query = searchQuery.toLowerCase();
    return billsToFilter.filter(
      (bill) =>
        bill.billType.toLowerCase().includes(query) ||
        bill.billNo.toLowerCase().includes(query) ||
        bill.sponsor.toLowerCase().includes(query)
    );
  }, [searchQuery, bills, tabValue, favorites]);

  const handleRowClick = useCallback((bill: Bill) => {
    setSelectedBill(bill);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedBill(null);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const toggleFavorite = useCallback((billId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(billId)) {
        newFavorites.delete(billId);
      } else {
        newFavorites.add(billId);
        console.log(`Add favorite to server`);
      }
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (billId: string) => {
      return favorites.has(billId);
    },
    [favorites]
  );

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
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <SearchInput onSearch={handleSearch} />
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label={`Bills`} />
          <Tab label={`Favourite Bills`} />
        </Tabs>
      </Box>

      <Box
        sx={{
          height: 'calc(100vh - 90px)',
          overflowY: 'auto',
          backgroundColor: 'transparent',
        }}
      >
        <TableContainer component={Paper} sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Bill Number</TableCell>
                <TableCell align="center">Bill Type</TableCell>
                <TableCell align="center">Bill Status</TableCell>
                <TableCell align="center">Sponsor</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" py={2}>
                      {tabValue === 1 && favorites.size === 0
                        ? 'No favourite bills yet'
                        : searchQuery
                          ? 'No results found for your search'
                          : 'No bills available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBills.map((bill, index) => (
                  <motion.tr
                    key={bill.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    whileHover={{ backgroundColor: '#f5f5f5' }}
                    onClick={() => handleRowClick(bill)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell align="center">{bill.billNo}</TableCell>
                    <TableCell align="center">{bill.billType}</TableCell>
                    <TableCell align="center">{bill.billStatus}</TableCell>
                    <TableCell align="center">{bill.sponsor}</TableCell>
                    <TableCell
                      align="center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Tooltip
                        title={
                          isFavorite(bill.id)
                            ? 'Remove from favorites'
                            : 'Add to favorites'
                        }
                        arrow
                        placement="top"
                      >
                        <IconButton
                          onClick={() => toggleFavorite(bill.id)}
                          aria-label={
                            isFavorite(bill.id)
                              ? 'Remove from favorites'
                              : 'Add to favorites'
                          }
                          size="small"
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            },
                            '&:focus': {
                              outline: 'none',
                            },
                          }}
                        >
                          {isFavorite(bill.id) ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {selectedBill && (
        <BillModal bill={selectedBill} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default BillTable;
