import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import {
  ToastContainer,
  Flip
} from 'react-toastify';

import AppRoutes from './routes';
import {
  createTheme,
  ThemeProvider,
  Box,
  Typography
} from '@mui/material';
import Modal from './components/modal';
import Button from './components/button';

const stateSelectors = createSelector(
  state => state.auth,
  (auth) => ({
    isTokenExpired: auth.isTokenExpired,
    message: auth.message
  })
);

const App = () => {
  const {
    isTokenExpired,
    message
  } = useSelector(stateSelectors);

  const theme = createTheme({ palette: { primary: { main: '#21069b' } } });

  const AuthTokenExpiredModal = () => {
    const logout = () => {
      sessionStorage.clear();
      window.location.replace('/');
    };

    return <>
      <Modal {...{
        title: 'Oops! something went wrong',
        isOpen: isTokenExpired
      }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography>
            {message}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button label='Logout' onClick={() => logout()}/>
        </Box>
      </Modal>
    </>;
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <AppRoutes/>

        <AuthTokenExpiredModal/>
      </ThemeProvider>

      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme='colored'
        transition={Flip}
      />
    </>
  );
};

export default App;
