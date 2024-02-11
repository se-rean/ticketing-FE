export const TICKETING_TABLE_HEADERS = [
  {
    rowId: 'fullName',
    label: 'Name',
    type: 'text'
  },
  {
    rowId: 'nationality',
    label: 'Nationality',
    type: 'text'
  },
  {
    rowId: 'pricetype_code',
    label: 'Type',
    type: 'text'
  },
  {
    rowId: 'total_amount',
    label: 'Price',
    type: 'text'
  },
  {
    rowId: 'status',
    label: 'Status',
    type: 'status'
  },
  {
    rowId: 'barcode',
    label: 'Barcode',
    type: 'barcode'
  }
];

export const TICKETING_EVENTS_TABLE_HEADERS = [
  {
    rowId: 'title',
    label: 'Title',
    type: 'text'
  },
  {
    rowId: 'performance_code',
    label: 'Performance Code',
    type: 'text'
  },
  {
    rowId: 'status',
    label: 'Status',
    type: 'status'
  },
  {
    rowId: 'start_date',
    label: 'Start Date',
    type: 'datetime'
  },
  {
    rowId: 'end_date',
    label: 'End Date',
    type: 'datetime'
  }
];

export const eventStatus = {
  PENDING_FOR_BARCODE_GENERATION: 'PENDING FOR BARCODE GENERATION',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const participantsStatus = {
  SOLD: 'SOLD',
  REFUNDED: 'REFUNEDED',
  PENDING: 'PENDING'
};