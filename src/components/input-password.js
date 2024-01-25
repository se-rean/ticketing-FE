import React, {
  useState,
  forwardRef,
  memo
} from 'react';

import {
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';

import {
  VisibilityOff,
  Visibility
} from '@mui/icons-material';

const InputPassword = forwardRef(({
  name,
  label,
  error = null,
  size='small',
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(prevState => !prevState);
  };

  return <>
    <TextField
      name={name}
      label={label}
      type={!showPassword ? 'password' : 'text'}
      fullWidth
      size={size}
      error={Boolean(error)}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        endAdornment: <InputAdornment position='end'>
          <IconButton
            onClick={togglePassword}
            edge="end"
          >
            {!showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }}
      helperText={error?.message}
      ref={ref}
      {...rest}
    />
  </>;
});

export default memo(InputPassword);