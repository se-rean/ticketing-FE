import React, { useState } from 'react';
import Header from './header';
import Nav from './nav';
import { styled } from '@mui/material/styles';

const MainLayout = ({ children }) => {
  const NAV_WIDTH = 240;
  const APP_BAR_MOBILE = 64;
  const APP_BAR_DESKTOP = 92;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const StyledRoot = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden'
  });

  const Main = styled('div')(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: APP_BAR_MOBILE + 24,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('md')]: {
      paddingTop: APP_BAR_DESKTOP + 24,
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4)
    }
  }));

  return <>
    <StyledRoot>
      <Header {...{
        handleToggleDrawer,
        NAV_WIDTH
      }}/>

      <Nav {...{
        handleToggleDrawer,
        drawerOpen,
        NAV_WIDTH
      }}/>

      <Main>

        {children}
      </Main>
    </StyledRoot>
  </>;
};

export default MainLayout;