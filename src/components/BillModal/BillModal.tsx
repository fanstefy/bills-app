import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Bill } from '../../types/bill';

interface BillModalProps {
  bill: Bill | null;
  onClose: () => void;
}

const BillModal: React.FC<BillModalProps> = ({ bill, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);

  if (!bill) return null;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog open={!!bill} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Bill Titles
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="English" />
          <Tab label="Gaeilge" />
        </Tabs>

        {tabIndex === 0 && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {bill.title_en}
          </Typography>
        )}

        {tabIndex === 1 && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {bill.title_ga}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BillModal;
