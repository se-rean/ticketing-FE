
/* eslint-disable no-unused-vars */

import React, { Fragment } from 'react';

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import AdminUnauthLayout from '../layouts/admin-unauth-layout';
import AdminAuthLayout from '../layouts/admin-auth-layout';

import CheckAuth from './check-auth';
import LoginPage from '../pages/login';
import DashboardPage from '../pages/admin/dashboard';
import EventsPage from '../pages/admin/events';
import ErrorPage from '../pages/error-page';
import CreateEventPage from '../pages/admin/events/create-event-page';
import PerformanceDetailsPage from '../pages/admin/events/performance-details-page';
import UsersPage from '../pages/admin/users';
import UsersFormPage from '../pages/admin/users/form';
import AccountSettingsPage from '../pages/admin/account-settings';
import LogsPage from '../pages/admin/logs';

const AppRoutes = () => {
  const userDetails = JSON.parse(sessionStorage.getItem('user'));

  const ADMIN_UNAUTH_ROUTES = [
    {
      path: '/',
      page: <LoginPage/>
    },
    {
      path: '/login',
      page: <LoginPage/>
    }
  ];

  const ADMIN_AUTH_ROUTES = [
    {
      path: '/admin',
      page: <DashboardPage/>
    },
    (userDetails?.role && userDetails.role === 'admin') && {
      path: '/admin/users',
      page: <UsersPage/>
    },
    (userDetails?.role && userDetails.role === 'admin') && {
      path: '/admin/users/add',
      page: <UsersFormPage/>
    },
    {
      path: '/admin/events',
      page: <EventsPage/>
    },
    {
      path: '/admin/events/add',
      page: <CreateEventPage/>
    },
    {
      path: '/admin/events/performance-details/:performanceCode',
      page: <PerformanceDetailsPage/>
    },
    {
      path: '/admin/account-settings',
      page: <AccountSettingsPage/>
    },
    {
      path: '/admin/logs',
      page: <LogsPage/>
    }
  ].filter(Boolean);

  return <>
    <BrowserRouter>
      <Routes>
        {ADMIN_UNAUTH_ROUTES.map((route, key) => (
          <Fragment key={key}>
            <Route
              key={key}
              path={route.path}
              element={
                <CheckAuth>
                  <AdminUnauthLayout>
                    {route.page}
                  </AdminUnauthLayout>
                </CheckAuth>
              }
            />
          </Fragment>
        ))}

        {ADMIN_AUTH_ROUTES.map((route, key) => (
          <Fragment key={key}>
            <Route
              key={key}
              path={route.path}
              element={
                <CheckAuth>
                  <AdminAuthLayout>
                    {route.page}
                  </AdminAuthLayout>
                </CheckAuth>
              }
            />
          </Fragment>
        ))}

        <Route
          path='*'
          element={<ErrorPage/>}
        />
      </Routes>
    </BrowserRouter>
  </>;
};

export default AppRoutes;