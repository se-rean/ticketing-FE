import React, {
  forwardRef,
  memo
} from 'react';

import { TextField } from '@mui/material';

const Input = forwardRef(({
  name,
  label,
  readOnly,
  size = 'small',
  error = null,
  ...rest
}, ref) => {
  return <>
    <TextField
      name={name}
      label={label}
      fullWidth
      size={size}
      error={Boolean(error)}
      InputLabelProps={{ shrink: true }}
      InputProps={{ readOnly: readOnly }}
      helperText={error?.message}
      ref={ref}
      {...rest}
    />
  </>;
});

export default memo(Input);