import React from 'react';

import {
  // Dashboard, 
  ConfirmationNumber,
  People,
  Book
} from '@mui/icons-material';

const userDetails = JSON.parse(sessionStorage.getItem('user'));

export default [
  // {
  //   label: 'Dashboard',
  //   icon: <Dashboard sx={{ color: 'white' }}/>,
  //   path: '/admin'
  // },
  (userDetails?.role && userDetails.role === 'admin') && {
    label: 'Users',
    icon: <People sx={{ color: 'white' }}/>,
    path: '/admin/users'
  },
  {
    label: 'Events',
    icon: <ConfirmationNumber sx={{ color: 'white' }}/>,
    path: '/admin/events'
  },
  {
    label: 'Logs',
    icon: <Book sx={{ color: 'white' }}/>,
    path: '/admin/logs'
  }
].filter(Boolean);