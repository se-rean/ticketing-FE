import React, { memo } from 'react';

import { Alert } from '@mui/material';

const FormErrorBanner = ({ message }) => {
  return <>
    <Alert severity='error'>
      {message}
    </Alert>
  </>;
};

export default memo(FormErrorBanner);