import React from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import { FindInPageOutlined } from '@mui/icons-material';

const EmptyBanner = ({ message = 'No Data Found' }) => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <FindInPageOutlined sx={{
      mr: 1,
      color: 'text.secondary',
      fontSize: 35
    }}/>

    <Typography sx={{ color: 'text.secondary' }} variant='h6'>
      {message}
    </Typography>
  </Box>
);

export default EmptyBanner;