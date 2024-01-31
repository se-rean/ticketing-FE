import React, {
  forwardRef,
  memo
} from 'react';

import { TextField } from '@mui/material';

const InputTextArea = forwardRef(({
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
      multiline
      rows={4}
      size={size}
      error={Boolean(error)}
      InputLabelProps={{ shrink: true }}
      inputProps={{ readOnly: readOnly }}
      helperText={error?.message}
      ref={ref}
      {...rest}
    />
  </>;
});

export default memo(InputTextArea);