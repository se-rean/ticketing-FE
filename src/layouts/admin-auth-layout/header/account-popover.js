/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { getUser } from '../../../helpers';
import { useNavigate } from 'react-router-dom';

import { alpha } from '@mui/material/styles';
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  IconButton,
  Popover,
  Avatar
} from '@mui/material';
import { Logout } from '@mui/icons-material';

const MENU_OPTIONS = [
  {
    label: 'Logout',
    icon: <Logout/>,
    onClick: (navigate) => {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    }
  }
];

const AccountPopover = () => {
  const [open, setOpen] = useState(null);

  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const {
    username: displayName,
    email
  } = getUser();

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: '\'\'',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8)
            }
          })
        }}
      >
        <Avatar/>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom', horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top', horizontal: 'right'
        }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75
            }
          }
        }}
      >
        <Box
          sx={{
            my: 1.5, px: 2.5
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {displayName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email || 'email@gmail.com'}
          </Typography>
        </Box>

        <Divider />

        <Stack sx={{ p: 0.5 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => {
                if (option.onClick) {
                  option.onClick(navigate);
                }
                handleClose();
              }}>
              {option.icon} &nbsp; {option.label}
            </MenuItem>
          ))}
        </Stack>
      </Popover>
    </>
  );
};

export default AccountPopover;