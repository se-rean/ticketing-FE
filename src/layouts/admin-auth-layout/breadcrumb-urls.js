import React from 'react';

import {
  Add,
  ConfirmationNumber,
  Dashboard,
  Info
} from '@mui/icons-material';

const BreadCrumbsUrls = ({ pathname, params }) => {
  const { performanceCode } = params;

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
      pathname: '/admin/events',
      link: [
        {
          label: 'Dashboard',
          icon: <Dashboard fontSize='inherit'/>,
          to: '/admin'
        },
        {
          label: 'events',
          icon: <ConfirmationNumber fontSize='inherit'/>,
          active: true
        }
      ]
    },
    {
      pathname: '/admin/events/create-event',
      link: [
        {
          label: 'Dashboard',
          icon: <Dashboard fontSize='inherit'/>,
          to: '/admin'
        },
        {
          label: 'Events',
          icon: <ConfirmationNumber fontSize='inherit'/>,
          to: '/admin/events'
        },
        {
          label: 'Event',
          icon: <Add fontSize='inherit'/>,
          active: true
        }
      ]
    },
    {
      pathname: `/admin/events/performance-details/${performanceCode}`,
      link: [
        {
          label: 'Dashboard',
          icon: <Dashboard fontSize='inherit'/>,
          to: '/admin'
        },
        {
          label: 'Events',
          icon: <ConfirmationNumber fontSize='inherit'/>,
          to: '/admin/events'
        },
        {
          label: 'Performance Details',
          icon: <Info fontSize='inherit'/>,
          active: true
        }
      ]
    }
  ];

  const findLink = links.find(i => i.pathname.includes(pathname));
  return findLink ? findLink.link : [];
};

export default BreadCrumbsUrls;