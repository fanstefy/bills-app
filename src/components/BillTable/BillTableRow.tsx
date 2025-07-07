import { TableCell, IconButton, Tooltip, Chip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { motion } from 'framer-motion';
import type { Bill } from '../../types/bill';

interface BillTableRowProps {
  bill: Bill;
  index: number;
  isFavorite: (billId: string) => boolean;
  toggleFavorite: (bill: Bill) => void;
  onRowClick: (bill: Bill) => void;
}

type StatusColor = 'success' | 'error' | 'warning' | 'info' | 'default';

const STATUS_COLORS: Record<string, StatusColor> = {
  Current: 'success',
  Withdrawn: 'warning',
  Enacted: 'info',
  Rejected: 'error',
  Defeated: 'error',
  Lapsed: 'default',
};

const BillTableRow: React.FC<BillTableRowProps> = ({
  bill,
  index,
  isFavorite,
  toggleFavorite,
  onRowClick,
}) => (
  <motion.tr
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.02 }}
    whileHover={{ backgroundColor: '#f5f5f5' }}
    onClick={() => onRowClick(bill)}
    style={{ cursor: 'pointer', textAlign: 'left' }}
  >
    <TableCell align="left">{bill.billNo}</TableCell>
    <TableCell align="left">{bill.billType}</TableCell>
    <TableCell align="left">
      <Chip
        label={bill.billStatus}
        color={STATUS_COLORS[bill.billStatus] || 'default'}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 600 }}
      />
    </TableCell>
    <TableCell align="left">{bill.sponsor}</TableCell>
    <TableCell align="left" onClick={(e) => e.stopPropagation()}>
      <Tooltip
        title={
          isFavorite(bill.id) ? 'Remove from favorites' : 'Add to favorites'
        }
        arrow
        placement="top"
      >
        <IconButton
          onClick={() => toggleFavorite(bill)}
          aria-label={
            isFavorite(bill.id) ? 'Remove from favorites' : 'Add to favorites'
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
);

export default BillTableRow;
