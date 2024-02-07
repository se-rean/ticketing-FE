import React, { memo } from 'react';

import {
  Modal as MUIModal,
  Box,
  Typography,
  Backdrop,
  Fade
} from '@mui/material';

const Modal = ({
  isOpen = false,
  title,
  handleClose,
  children,
  customStyle = {
    width: '80%',
    maxWidth: 600
  },
  alignTitle = 'left'
}) => {
  return <>
    <MUIModal
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      aria-labelledby='modal-modal-title'
      disableEnforceFocus
      keepMounted
      sx={{ overflowY: 'auto' }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            ...{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 3,
              borderRadius: 2
            },
            ...customStyle
          }}
        >
          <Typography align={alignTitle} className='mb-4' id='modal-modal-title' variant='h6' component='h2'>
            <strong>
              {title}
            </strong>
          </Typography>

          <Box
            sx={{ mt: 2 }}
          >
            {children}
          </Box>
        </Box>
      </Fade>
    </MUIModal>
  </>;
};

export default memo(Modal);