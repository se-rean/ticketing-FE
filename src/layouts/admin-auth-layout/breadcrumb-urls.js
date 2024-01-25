import React from 'react';

import {
  ConfirmationNumber,
  Dashboard
} from '@mui/icons-material';

const BreadCrumbsUrls = (pathname) => {
  const links = [
    {
      pathname: '/admin',
      link: [
        {
          label: 'Dashboard',
          icon: <Dashboard fontSize='inherit'/>,
          active: true
        }
      ]
    },
    {
      pathname: '/tickets',
      link: [
        {
          label: 'Dashboard',
          icon: <Dashboard fontSize='inherit'/>,
          to: '/admin'
        },
        {
          label: 'Tickets',
          icon: <ConfirmationNumber fontSize='inherit'/>,
          active: true
        }
      ]
    }
  ];

  const findLink = links.find(i => i.pathname === pathname);
  return findLink ? findLink.link : [];
};

export default BreadCrumbsUrls;