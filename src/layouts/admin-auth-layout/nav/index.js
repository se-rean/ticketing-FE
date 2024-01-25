import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { getUser } from '../../../utils';
import navItems from '../nav-items';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  Divider
} from '@mui/material';
import useResponsive from '../../../hooks/use-responsive';

const RenderContent = () => {
  const navigate = useNavigate();

  // const {
  //   fullName,
  //   role
  // } = getUser();

  return <>
    <Box>
      <Toolbar>
      </Toolbar>

      <Divider />

      <List>
        {navItems && navItems.map((i, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => navigate(i.path)}>
              <ListItemIcon>
                {i.icon}
              </ListItemIcon>
              <ListItemText primary={<strong>{i.label}</strong>} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  </>;
};

const Nav = ({
  handleToggleDrawer,
  drawerOpen,
  NAV_WIDTH
}) => {
  const isDesktop = useResponsive('up', 'md');

  return <>
    <Box
      component='nav'
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH }
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              color: 'white',
              bgcolor: 'rgba(33, 6, 155, 1)'
            }
          }}
        >
          <RenderContent/>
        </Drawer>
      ) : (
        <Drawer
          open={drawerOpen}
          onClose={handleToggleDrawer}
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              color: 'white',
              bgcolor: 'rgba(33, 6, 155, 1)'
            }
          }}
          ModalProps={{ keepMounted: true }}
        >
          <RenderContent/>
        </Drawer>
      )}
    </Box>
  </>;
};

export default Nav;