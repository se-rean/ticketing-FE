import React, { memo } from 'react';

import {
  Breadcrumbs as MUIBreadCrumbs,
  Stack,
  Link
} from '@mui/material';

import { useNavigate } from 'react-router';

const BreadCrumbs = ({ links }) => {
  const navigate = useNavigate();

  return <>
    <Stack spacing={2}>
      <MUIBreadCrumbs>
        {links && links.map((link, i) => (
          <div key={i}>
            <Link
              sx={{
                fontSize: 13,
                cursor: 'pointer',
                pointerEvents: link?.active ? 'none' : ''
              }}
              className='breadcrumbs-link'
              key={i}
              underline='hover'
              color={link.color ? link.color : 'text.primary'}
              onClick={() => navigate(link.to)}
              separator="›"
            >
              <strong>
                <span style={{ marginRight: 2 }}>
                  {link.icon &&
                    link.icon
                  }
                </span>

                {link.label}
              </strong>
            </Link>
          </div>
        ))}
      </MUIBreadCrumbs>
    </Stack>
  </>;
};

export default memo(BreadCrumbs);