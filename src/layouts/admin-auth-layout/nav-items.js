import React from 'react';

import {
  // Dashboard, 
  ConfirmationNumber,
  People
} from '@mui/icons-material';

export default [
  // {
  //   label: 'Dashboard',
  //   icon: <Dashboard sx={{ color: 'white' }}/>,
  //   path: '/admin'
  // },
  {
    label: 'Users',
    icon: <People sx={{ color: 'white' }}/>,
    path: '/admin/users'
  },
  {
    label: 'Events',
    icon: <ConfirmationNumber sx={{ color: 'white' }}/>,
    path: '/admin/events'
  }
];