import { TableCell, IconButton, Tooltip } from '@mui/material';
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
    style={{ cursor: 'pointer' }}
  >
    <TableCell align="center">{bill.billNo}</TableCell>
    <TableCell align="center">{bill.billType}</TableCell>
    <TableCell align="center">{bill.billStatus}</TableCell>
    <TableCell align="center">{bill.sponsor}</TableCell>
    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
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
