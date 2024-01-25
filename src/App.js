import React from 'react';
import AppRoutes from './routes';
import {
  createTheme,
  ThemeProvider
} from '@mui/material';

const App = () => {
  const theme = createTheme({ palette: { primary: { main: '#21069b' } } });

  return (
    <ThemeProvider theme={theme}>
      <AppRoutes/>
    </ThemeProvider>
  );
};

export default App;
