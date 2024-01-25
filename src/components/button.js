import React from 'react';

import { Button as MUIButton } from '@mui/material';

const Button = ({
  className = '',
  sx = {},
  label,
  type = '',
  variant = 'contained',
  size = 'medium',
  endIcon,
  startIcon,
  color = 'primary',
  disabled,
  onClick,
  component,
  children
}) => {
  return <>
    <MUIButton
      type={type}
      className={`${className}`}
      component={component}
      sx={{
        ...{ textTransform: 'none' }, ...sx
      }}
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      size={size}
      color={color}
      onClick={onClick}
      disabled={disabled}
    >
      <strong>
        {label}
      </strong>

      {children}
    </MUIButton>
  </>;
};

export default Button;