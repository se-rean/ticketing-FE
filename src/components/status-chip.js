import React from 'react';
import { Chip } from '@mui/material';
import {
  eventStatus,
  participantsStatus
} from '../utils/constants';

const StatusChip = ({ label }) => {
  let color;
  switch (label) {
    case eventStatus.COMPLETED:
      color = 'success';
      break;
    case participantsStatus.SOLD:
      color = 'success';
      break;
    case eventStatus.PENDING_FOR_BARCODE_GENERATION:
      color = 'warning';
      break;
    case eventStatus.CANCELLED:
      color = 'error';
      break;
    case participantsStatus.REFUNDED:
      color = 'error';
      break;
    case participantsStatus.PENDING:
      color = 'warning';
      break;
    default:
      color = 'primary';
  }

  return <>
    <Chip
      size='small'
      label={label}
      color={color}
    />
  </>;
};

export default StatusChip;