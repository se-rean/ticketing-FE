import React from 'react';

import { Box } from '@mui/material';

const ErrorPage = () => {
  return <>
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h1>
        404 Page not found.
      </h1>
    </Box>
  </>;
};

export default ErrorPage;