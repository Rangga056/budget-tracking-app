'use client';

import { useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, useMediaQuery, useTheme, Zoom } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import TransactionDialog from './TransactionDialog';
import { useRouter } from 'next/navigation';

export default function GlobalAddButton() {
  const [open, setOpen] = useState(false);
  const [txDialogOpen, setTxDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const actions = [
    { 
      icon: <ReceiptLongRoundedIcon />, 
      name: 'Add Transaction', 
      onClick: () => setTxDialogOpen(true) 
    },
    { 
      icon: <CategoryRoundedIcon />, 
      name: 'Manage Categories', 
      onClick: () => router.push('/categories') 
    },
  ];

  return (
    <>
      <Zoom in timeout={500} unmountOnExit>
        <SpeedDial
          ariaLabel="Global Add SpeedDial"
          sx={{ 
            position: 'fixed', 
            bottom: isMobile ? 80 : 32, 
            right: 32,
            '& .MuiSpeedDial-fab': {
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #0058be, #0072ff)',
              boxShadow: '0 8px 32px rgba(0, 88, 190, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #004da7, #0066e5)',
              }
            }
          }}
          icon={<SpeedDialIcon openIcon={<AddRoundedIcon />} />}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen={!isMobile}
              onClick={() => {
                setOpen(false);
                action.onClick();
              }}
              sx={{
                '& .MuiSpeedDialAction-fab': {
                  backgroundColor: 'background.paper',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  }
                }
              }}
            />
          ))}
        </SpeedDial>
      </Zoom>

      <TransactionDialog 
        open={txDialogOpen} 
        onClose={() => setTxDialogOpen(false)} 
        onSuccess={() => {
          // You might want to refresh current page data here
          // For now, next.js router refresh helps
          router.refresh();
        }}
      />
    </>
  );
}
