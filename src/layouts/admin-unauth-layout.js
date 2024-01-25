import React from 'react';

import {
  Box,
  Grid
} from '@mui/material';

const AdminUnauthLayout = ({ children }) => {
  return <>
    <Box sx={{
      height: '100vh',
      backgroundImage: 'radial-gradient(#21069b 1.5px, transparent 1.5px)',
      backgroundSize: '32px 32px',
      backgroundColor: 'white'
    }}>

      <Grid container spacing={0}>
        <Grid item md={8} lg={9} xl={9}>
          <Box
            sx={{
              height: '100vh',
              display: {
                xs: 'none', md: 'block flex'
              },
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img style={{ objectFit: 'contain' }} src={`${process.env.PUBLIC_URL}/assets/images/login-banner.png`} />
          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
          <Box sx={{
            height: '100vh',
            backgroundColor: 'white',
            boxShadow: 2
          }}>
            <Box sx={{
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: {
                xs: '0px 25px',
                sm: '0px 150px',
                md: '0px 15px',
                lg: '0px 30px',
                xl: '0px 30px'
              }
            }}>
              { children }
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </>;
};

export default AdminUnauthLayout;