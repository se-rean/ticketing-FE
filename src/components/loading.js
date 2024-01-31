import React from 'react';
import {
  Box,
  CircularProgress
} from '@mui/material';

const Loading = ({ color = 'black' }) => {
  return <>
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CircularProgress sx={{ color }}/>
    </Box>
  </>;
};

export default Loading;