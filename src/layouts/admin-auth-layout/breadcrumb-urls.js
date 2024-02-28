import React from 'react';

import {
  Add,
  Book,
  ConfirmationNumber,
  Dashboard,
  Edit,
  Info,
  People,
  Settings
} from '@mui/icons-material';

const BreadCrumbsUrls = ({ pathname, params }) => {
  const { performanceCode, editId } = params;

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
      pathname: '/admin/users',
      link: [
        {
          label: 'Dashboard',
          icon: <Dashboard fontSize='inherit'/>,
          to: '/admin'
        },
        {
          label: 'Users',
          icon: <People fontSize='inherit'/>,
          active: true
        }
      ]
    },
    {
      pathname: '/admin/users/add',
      link: [
        {
          label: 'Dashboard',
          icon: <Dashboard fontSize='inherit'/>,
          to: '/admin'
        },
        {
          label: 'Users',
          icon: <People fontSize='inherit'/>,
          to: '/admin/users'
        },
        {
          label: 'Add',
          icon: <Add fontSize='inherit'/>,
          active: true
        }
      ]
    },
    {
      pathname: `/admin/users/edit/${editId}`,
      link: [
        {
          label: 'Dashboard',
          icon: <Dashboard fontSize='inherit'/>,
          to: '/admin'
        },
        {
          label: 'Users',
          icon: <People fontSize='inherit'/>,
          to: '/admin/users'
        },
        {
          label: 'Edit',
          icon: <Edit fontSize='inherit'/>,
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
          label: 'Events',
          icon: <ConfirmationNumber fontSize='inherit'/>,
          active: true
        }
      ]
    },
    {
      pathname: '/admin/events/add',
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
          label: 'Add',
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
    },
    {
      pathname: '/admin/account-settings',
      link: [
        {
          label: 'Dashboard',
          icon: <Dashboard fontSize='inherit'/>,
          to: '/admin'
        },
        {
          label: 'Account Settings',
          icon: <Settings fontSize='inherit'/>,
          active: true
        }
      ]
    },
    {
      pathname: '/admin/logs',
      link: [
        {
          label: 'Dashboard',
          icon: <Dashboard fontSize='inherit'/>,
          to: '/admin'
        },
        {
          label: 'Logs',
          icon: <Book fontSize='inherit'/>,
          active: true
        }
      ]
    }
  ];

  const findLink = links.find(i => i.pathname.includes(pathname));
  return findLink ? findLink.link : [];
};

export default BreadCrumbsUrls;