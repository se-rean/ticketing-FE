import React, {
  forwardRef,
  memo
} from 'react';

import {
  TextField as Input,
  InputAdornment,
  IconButton,
  MenuItem
} from '@mui/material';

import { Add } from '@mui/icons-material';

const InputSelect = forwardRef(({
  name,
  label,
  error = null,
  options = [],
  size = 'small',
  hasQuickAdd = false,
  quickAddPath = '',
  fullWidth = true,
  ...rest
}, ref) => {
  return <>
    <Input
      name={name}
      label={label}
      select
      fullWidth={fullWidth}
      size={size}
      error={Boolean(error)}
      InputProps={{
        endAdornment: hasQuickAdd && <InputAdornment position='start'>
          <IconButton
            color='secondary'
            className='me-2'
            size='small'
            onClick={()=>window.open(`${process.env.PUBLIC_URL}${quickAddPath}`,'_blank')}
            edge='start'
          >
            <Add style={{ fontSize: 18 }}/>
          </IconButton>
        </InputAdornment>
      }}
      InputLabelProps={{ shrink: true }}
      helperText={error?.message}
      ref={ref}
      {...rest}
    >
      {options.map((data, i) => (
        <MenuItem style={{
          fontWeight: 400, color: 'gray'
        }} key={i} value={data.value}>
          {data.label}
        </MenuItem>
      ))}
    </Input>
  </>;
});

export default memo(InputSelect);
