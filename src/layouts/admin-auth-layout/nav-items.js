import React from 'react';

import {
  Dashboard, ConfirmationNumber
} from '@mui/icons-material';

export default [
  {
    label: 'Dashboard',
    icon: <Dashboard sx={{ color: 'white' }}/>,
    path: '/admin'
  },
  {
    label: 'Tickets',
    icon: <ConfirmationNumber sx={{ color: 'white' }}/>,
    path: '/admin/tickets'
  }
];