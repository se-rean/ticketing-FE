import React, {
  useEffect,
  useState
} from 'react';
import {
  useLocation, useParams
} from 'react-router-dom';
import BreadCrumbsUrl from '../breadcrumb-urls';

import BreadCrumbs from '../../../components/breadcrumbs';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Stack
} from '@mui/material';
import AccountPopover from './account-popover';
import { Menu } from '@mui/icons-material';

const Header = ({
  handleToggleDrawer,
  NAV_WIDTH
}) => {
  const [breadCrumbsLink, setBreadCrumbsLink] = useState([]);

  const { pathname } = useLocation();
  const { performanceCode, editId } = useParams();

  useEffect(() => {
    setBreadCrumbsLink(BreadCrumbsUrl({
      pathname,
      params: {
        performanceCode,
        editId
      }
    }));
  }, [pathname]);

  return <>
    <AppBar
      position='fixed'
      sx={{
        boxShadow: 1,
        backgroundColor: 'white',
        width: { sm: `calc(100% - ${NAV_WIDTH}px)` },
        ml: { sm: `${NAV_WIDTH}px` }
      }}
    >
      <Toolbar>
        <IconButton
          onClick={handleToggleDrawer}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' }
          }}
        >
          <Menu/>
        </IconButton>

        <Box>
          <BreadCrumbs {...{ links: breadCrumbsLink }}/>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1
          }}
        >
          <AccountPopover />
        </Stack>
      </Toolbar>
    </AppBar>
  </>;
};

export default Header;