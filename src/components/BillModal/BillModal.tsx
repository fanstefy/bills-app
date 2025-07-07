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
import { TabContext, TabPanel } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import type { Bill } from '../../types/bill';

interface BillModalProps {
  bill: Bill | null;
  onClose: () => void;
}

const BillModal: React.FC<BillModalProps> = ({ bill, onClose }) => {
  const [tabIndex, setTabIndex] = useState('0');

  if (!bill) return null;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog open={!!bill} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center" sx={{ color: '#222' }}>
        Bill Titles
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          color: '#222',
        }}
      >
        <TabContext value={tabIndex}>
          <Tabs
            value={tabIndex}
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
              label="English"
              value="0"
              sx={{
                borderBottom: tabIndex === '0' ? '1px solid #1976d2' : 'none',
                transition: 'border-bottom 0.2s',
              }}
            />
            <Tab
              label="Gaeilge"
              value="1"
              sx={{
                borderBottom: tabIndex === '1' ? '1px solid #1976d2' : 'none',
                transition: 'border-bottom 0.2s',
              }}
            />
          </Tabs>

          <TabPanel value="0">
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              {bill.title_en}
            </Typography>
          </TabPanel>

          <TabPanel value="1">
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              {bill.title_ga}
            </Typography>
          </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  );
};

export default BillModal;
