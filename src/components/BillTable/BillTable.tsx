import { useState } from 'react';
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
} from '@mui/material';
import type { Bill } from '../../types/bill';
import BillModal from '../BillModal';

interface BillTableProps {
  bills: Bill[];
  loading: boolean;
  error: string | null;
}

const BillTable: React.FC<BillTableProps> = ({ bills, loading, error }) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  const handleRowClick = (bill: Bill) => {
    setSelectedBill(bill);
  };

  const handleCloseModal = () => {
    setSelectedBill(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bill Number</TableCell>
              <TableCell>Bill Type</TableCell>
              <TableCell>Bill Status</TableCell>
              <TableCell>Sponsor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.map((bill) => (
              <TableRow
                key={bill.billNo}
                hover
                onClick={() => handleRowClick(bill)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{bill.billNo}</TableCell>
                <TableCell>{bill.billType}</TableCell>
                <TableCell>{bill.billStatus}</TableCell>
                <TableCell>{bill.sponsor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BillModal bill={selectedBill} onClose={handleCloseModal} />
    </>
  );
};

export default BillTable;
