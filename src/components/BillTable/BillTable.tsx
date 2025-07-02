import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import BillTableRow from './BillTableRow';
import type { Bill } from '../../types/bill';

interface BillTableProps {
  bills: Bill[];
  isFavorite: (billId: string) => boolean;
  toggleFavorite: (bill: Bill) => void;
  onRowClick: (bill: Bill) => void;
  currentPage: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (_event: unknown, newPage: number) => void;
  showPagination: boolean;
  loading: boolean;
  tabValue: number;
  searchQuery: string;
}

const BillTable: React.FC<BillTableProps> = ({
  bills,
  isFavorite,
  toggleFavorite,
  onRowClick,
  currentPage,
  rowsPerPage,
  totalCount,
  onPageChange,
  showPagination,
  loading,
  tabValue,
  searchQuery,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={24}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
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
          {bills.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body2" color="text.secondary" py={2}>
                  {tabValue === 1
                    ? 'No favorite bills'
                    : searchQuery
                      ? 'No results found for your search'
                      : 'No bills available'}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            bills.map((bill, index) => (
              <BillTableRow
                key={bill.id}
                bill={bill}
                index={index}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                onRowClick={onRowClick}
              />
            ))
          )}
        </TableBody>
      </Table>
      {showPagination && (
        <TablePagination
          component="div"
          count={totalCount}
          page={currentPage}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      )}
    </TableContainer>
  );
};

export default BillTable;
