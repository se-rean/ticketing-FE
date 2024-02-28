/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {
  Fragment,
  useState,
  useEffect,
  useRef
} from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import {
  useNavigate,
  useParams
} from 'react-router-dom';
import { createSelector } from 'reselect';
import {
  createParticipantsAction,
  getParticipantsAction,
  getPerformanceDetailsAction,
  createParticipantsBarcodeAction,
  refundParticipantsAction,
  setTableSelectedIdsAction,
  deleteParticipantsAction,
  setParticipantsDataAction
} from '../../../redux-saga/actions';
import { dateTime } from '../../../utils/date-formats';
import { TICKETING_TABLE_HEADERS } from '../../../utils/constants';
import {
  toastError,
  exportToCSV
} from '../../../helpers';
import * as XLSX from 'xlsx';
import {
  isEmpty,
  map,
  zipObject,
  debounce
} from 'lodash';

import {
  Divider,
  Grid,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  IconButton,
  Tooltip,
  Box,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  QrCode,
  Replay,
  Download,
  Add,
  Event,
  Upload,
  Delete,
  Edit
} from '@mui/icons-material';

import Table from '../../../components/table';
import Loading from '../../../components/loading';
import Modal from '../../../components/modal';
import InputSelect from '../../../components/input-select';
import Button from '../../../components/button';
import AddParticipantsForm from './add-participants-form';
import EditParticipantsForm from './edit-participants-form';
import StatusChip from '../../../components/status-chip';
import Input from '../../../components/input';

const stateSelectors = createSelector(
  state => state.ticket,
  state => state.table,
  (ticket, table) => ({
    performanceDetails: ticket.performanceDetails,
    loading: ticket.loading,
    participantsLoading: ticket.participantsLoading,
    participants: ticket.participants,
    page: table.page,
    pageSize: table.pageSize,
    selectedTableIds: table.selectedIds,
    totalTableRows: table.totalTableRows,
    pendingCount: ticket.pendingCount,
    refundedCount: ticket.refundedCount,
    soldCount: ticket.soldCount,
    failedCount: ticket.failedCount
  })
);

const PerformanceDetailsPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);
  const [statusInputValue, setStatusInputValue] = useState('all-status');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [tableRows, setTableRows] = useState([]);

  const searchInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { performanceCode } = useParams();

  const {
    loading,
    participantsLoading,
    performanceDetails,
    participants,
    selectedTableIds,
    page,
    pageSize,
    totalTableRows,
    pendingCount,
    refundedCount,
    soldCount,
    failedCount
  } = useSelector(stateSelectors);

  const fetchParticipants = () => {
    dispatch(getParticipantsAction({
      performanceCode: performanceCode,
      page: page + 1,
      pageSize,
      status: getParticipantsStatusId()
    }));
  };

  const getParticipantsStatusId = () => {
    switch(statusInputValue) {
      case 'all-status':
        return '';
      case 'pending':
        return 1;
      case 'refunded':
        return 2;
      case 'failed':
        return 3;
      case 'sold':
        return 4;
      default:
        return '';
    }
  };

  const getParticipantsCount = () => {
    switch(statusInputValue) {
      case 'all-status':
        return pendingCount + refundedCount + soldCount + failedCount;
      case 'pending':
        return pendingCount;
      case 'refunded':
        return refundedCount;
      case 'failed':
        return failedCount;
      case 'sold':
        return soldCount;
      default:
        return '';
    }
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];

    const acceptedFileTypes = 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv,';

    const ACCEPT_TYPE_MAPPER = acceptedFileTypes.split(/[ ,]+/);

    if (!ACCEPT_TYPE_MAPPER.includes(file.type)) {
      toastError('Upload failed, the uploader accepts excel file only.');
      document.getElementById('import-input').value = '';
    }

    readExcelData(file).then((result) => {
      try {
        const keys = result[0];
        const zippedResult = map(result.slice(1), entry => zipObject(keys, entry));

        const payload = zippedResult.map(item => {
          const ticketPrice = performanceDetails.event_pricing.find(pricing => pricing.type_code === item['pricetypecode'])?.amount || 0;

          const newItems = {
            ...item,
            performance_code: item.performancecode,
            address_line_1: item.addressline1,
            pricetype_code: item['pricetypecode'],
            amount: ticketPrice,
            totalAmount: ticketPrice * item['quantity']
          };

          return newItems;
        }).filter(payload => !isEmpty(payload.performance_code)
          && !isEmpty(payload.area)
          && payload.performance_code.includes(performanceCode)
          && performanceDetails.event_pricing.some(pricing => payload.area.includes(pricing.section))
        );

        dispatch(createParticipantsAction(payload)).then(() => {
          fetchParticipants();
        });

        document.getElementById('import-input').value = '';
      } catch (err) {
        console.log(err);
      }
    })
      .catch((error) => {
        toastError(error);
        document.getElementById('import-input').value = '';
      });
  };

  const readExcelData = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, {
        type: 'array',
        cellStyles: true
      });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        header: 1, defval: ''
      });

      resolve(jsonData);
    };

    reader.readAsArrayBuffer(file);
  });

  const handlePricingExpandChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleGenerateBarcode = () => {
    const payload = {
      participantsIds: [],
      performanceCode: performanceCode
    };

    dispatch(createParticipantsBarcodeAction(payload))
      .then(() => {
        fetchParticipants();
      });
  };

  const handleDownloadParticipants = () => {
    const payload = {
      performanceCode: performanceCode,
      page: 1,
      pageSize: 1000000,
      status: getParticipantsStatusId()
    };

    dispatch(getParticipantsAction(payload))
      .then(({
        payload: {
          data: {
            data: result,
            is_success: isSuccess
          }
        }
      }) => {
        if (isSuccess) {
          const mappedResult = result.map(i => ({
            Firstname: i.firstname,
            Lastname: i.lastname,
            Email: i.email,
            Phone: i.phonenumber,
            ['Job Title']: i.job_title,
            Company: i.company_name,
            Type: i.type,
            Barcode: i.barcode,
            ['Event']: performanceDetails.name,
            ['Event Area']: i.area,
            ['Event Type']: i.pricetype_code
          }));

          const date = new Date();
          exportToCSV(mappedResult, 'event_barcode');
        }
      });
  };

  const handleRefundParticipants = () => {
    const filterParticipants = participants.filter(p => selectedTableIds.includes(p.id) && p.status != 'sold');
    if (filterParticipants && filterParticipants.length > 0) return toastError('Participant/s status not allowed for refund.');
    dispatch(refundParticipantsAction({
      performanceCode,
      participants: selectedTableIds
    })).then((res) => {
      const { payload: { data: { is_success: isSuccess } } } = res;
      dispatch(setTableSelectedIdsAction([]));

      if (isSuccess) {
        fetchParticipants();
      }
    });
  };

  const handleConfirm = (event, mode, row = null) => {
    event.stopPropagation();
    setIsConfirmOpen(!isConfirmOpen);
    setConfirmMode(mode);
    if (!isEmpty(row)) {
      if (mode == 'Refund' && row.status !== 'sold') return;
      dispatch(setTableSelectedIdsAction([]));
      dispatch(setTableSelectedIdsAction([row.id]));
    }
  };

  const handleClose = () => {
    setIsConfirmOpen(false);
    dispatch(setTableSelectedIdsAction([]));
  };

  const handleYes = () => {
    if (confirmMode === 'Generate Barcode') {
      handleGenerateBarcode();
    } else if (confirmMode === 'Refund') {
      handleRefundParticipants();
    } else if (confirmMode === 'Export to Excel') {
      handleDownloadParticipants();
    } else if (confirmMode === 'Delete') {
      handleDelete();
    }

    setIsConfirmOpen(!isConfirmOpen);
  };

  const handleEdit = (e, row) => {
    e.stopPropagation();

    if (!isEmpty(row)) {
      setIsEditFormOpen(!isEditFormOpen);
      setSelectedRow(row);
    }
  };

  const handleDelete = () => {
    dispatch(deleteParticipantsAction(selectedTableIds)).then(() => {
      const newParticipants = [...participants];
      const index = newParticipants.findIndex(i => i.id === selectedTableIds[0]);
      newParticipants.splice(index, 1);
      dispatch(setParticipantsDataAction(newParticipants));
      dispatch(setTableSelectedIdsAction([]));
    });
  };

  const handleFilterStatusChange = (e) => {
    setStatusInputValue(e.target.value);
  };

  const searchCallBack = (value) => {
    setSearchInputValue(value);

    let newParticipants = [...participants];
    const searchValue = value.toLowerCase();
    const filter = newParticipants.filter(i =>
      i.fullName.toLowerCase().includes(searchValue)
      || i?.nationality?.toLowerCase().includes(searchValue)
      || i?.type?.toLowerCase().includes(searchValue)
      || i?.area?.toLowerCase().includes(searchValue)
      || i?.barcode?.toLowerCase().includes(searchValue)
    );

    setTableRows(filter);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const debouncedHandleInputChange = debounce(searchCallBack, 500);

  const handleSearchChange = (value) => {
    debouncedHandleInputChange(value);
  };

  useEffect(() => {
    dispatch(getPerformanceDetailsAction(performanceCode));
  }, []);

  useEffect(() => {
    fetchParticipants();
  }, [page, pageSize, statusInputValue]);

  useEffect(() => {
    setTableRows(participants);
  }, [participants]);

  let confirmationMessage;
  switch(confirmMode) {
    case 'Delete':
      confirmationMessage = 'Are you sure you want to Delete the selected row?';
      break;
    case 'Refund':
      confirmationMessage = 'Are you sure you want to Refund the selected rows?';
      break;
    case 'Export to Excel':
      confirmationMessage = 'Are you sure you want to Export into Excel the table datas?';
      break;
    case 'Generate Barcode':
      confirmationMessage = 'Are you sure you want to Generate the Barcodes of the table datas?';
      break;
    default:
      confirmationMessage = '';
  }

  const CountChip = () => {
    return <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'start',
        gap: 2
      }}>
        <Chip size='small' color='warning' label={`PENDING - ${pendingCount}`}/>

        <Chip size='small' color='error' label={`REFUNDED - ${refundedCount}`}/>

        <Chip size='small' color='success' label={`SOLD - ${soldCount}`}/>

        <Chip size='small' color='error' label={`FAILED - ${failedCount}`}/>
      </Box>
    </>;
  };

  return <>
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          {!loading
            ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography color='primary'>
                        <strong>Event Details</strong>
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            Performance Code:
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            {performanceDetails.performance_code}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            Name:
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            {performanceDetails.name ? performanceDetails.name : '--'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            Status:
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            {performanceDetails.status ? <StatusChip label={performanceDetails.status.toUpperCase()}/> : '--'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            Start Date:
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            {performanceDetails.start_date ? dateTime(performanceDetails.start_date) : '--'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            End Date:
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            {performanceDetails.end_date ? dateTime(performanceDetails.end_date) : '--'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            Venue:
                          </Typography>
                        </Grid>

                        <Grid item xs={12} md={6} lg={6} xl={6}>
                          <Typography variant='subtitle2'>
                            {performanceDetails.venue_code ? performanceDetails.venue_code : '--'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )
            : (
              <Loading/>
            )
          }
        </Card>
      </Grid>

      {!isEmpty(performanceDetails.event_pricing) &&
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            {!loading
              ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography color='primary'>
                      <strong>Pricing Details</strong>
                    </Typography>
                  </Grid>

                  {performanceDetails.event_pricing.map((i, index) => (
                    <Fragment key={index}>
                      <Grid item xs={12} md={6} lg={4} xl={4}>
                        <Accordion expanded={expanded === `panel${index + 1}`} onChange={handlePricingExpandChange(`panel${index + 1}`)}>
                          <AccordionSummary expandIcon={<ExpandMore/>}>
                            <Typography color='warning.main'>
                              <strong>{`${i.section} - ${i.type_code}`}</strong>
                            </Typography>
                          </AccordionSummary>

                          <AccordionDetails>
                            <Grid container spacing={0.5}>
                              <Grid item xs={12}>
                                <Grid container spacing={0}>
                                  <Grid item xs={6} md={6} lg={6} xl={6}>
                                    <Typography variant='subtitle2'>
                                      Capacity:
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={6} md={6} lg={6} xl={6}>
                                    <Typography variant='subtitle2'>
                                      {i.capacity}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={6} md={6} lg={6} xl={6}>
                                    <Typography variant='subtitle2'>
                                      Price:
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={6} md={6} lg={6} xl={6}>
                                    <Typography variant='subtitle2'>
                                      {i.amount}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={6} md={6} lg={6} xl={6}>
                                    <Typography variant='subtitle2'>
                                      State:
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={6} md={6} lg={6} xl={6}>
                                    <Typography color={i.state ? 'success.main' : 'error.main'} variant='subtitle2'>
                                      {i.state}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={6} md={6} lg={6} xl={6}>
                                    <Typography variant='subtitle2'>
                                      Sold:
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={6} md={6} lg={6} xl={6}>
                                    <Typography color={i.state ? 'success.main' : 'error.main'} variant='subtitle2'>
                                      {i.sold}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={6} md={6} lg={6} xl={6}>
                                    <Typography variant='subtitle2'>
                                      Refunded:
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={6} md={6} lg={6} xl={6}>
                                    <Typography color={i.state ? 'success.main' : 'error.main'} variant='subtitle2'>
                                      {i.refunded}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    </Fragment>
                  ))}
                </Grid>
              )
              : (
                <Loading/>
              )
            }
          </Card>
        </Grid>
      }
      {
        !isEmpty(performanceDetails.event_pricing) && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography color='primary'>
                    {!isAddFormOpen && !isEditFormOpen && (
                      <>
                        <Box sx={{ mb: 2 }}>
                          <Typography color='primary'>
                            <strong>Participants</strong>
                          </Typography>
                        </Box>

                        <CountChip/>
                      </>
                    )}

                    {isAddFormOpen && (
                      <strong>Add Participants</strong>
                    )}

                    {isEditFormOpen && (
                      <strong>Edit Participants</strong>
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  {!isAddFormOpen && !isEditFormOpen && (
                    <Table {...{
                      loading: participantsLoading,
                      headers: TICKETING_TABLE_HEADERS,
                      rows: tableRows,
                      totalTableRows,
                      headerActions: (
                        <>
                          <Box>
                            {performanceDetails.status == 'Pending For Barcode Generation' && (
                              <>
                                <Tooltip title='Generate Barcode'>
                                  <IconButton onClick={(e) => handleConfirm(e, 'Generate Barcode')} disabled={isEmpty(participants)}>
                                    <QrCode />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title='Process Refund'>
                                  <IconButton color='warning' onClick={(e) => handleConfirm(e, 'Refund')} disabled={selectedTableIds.length === 0}>
                                    <Replay />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title='Import Excel'>
                                  <IconButton color='success' component="label">
                                    <Upload />

                                    <input
                                      id='import-input'
                                      type='file'
                                      hidden
                                      accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv,'
                                      onChange={handleUploadFile} />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title='Add Participants'>
                                  <IconButton color='primary' onClick={() => setIsAddFormOpen(!isAddFormOpen)}>
                                    <Add />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}

                            <Tooltip title='Create New Event'>
                              <IconButton color='primary' onClick={() => navigate('/admin/events/add')}>
                                <Event/>
                              </IconButton>
                            </Tooltip>

                            <Tooltip title='Export to Excel'>
                              <IconButton color='success' onClick={(e) => handleConfirm(e, 'Export to Excel')} disabled={isEmpty(participants)}>
                                <Download/>
                              </IconButton>
                            </Tooltip>
                          </Box>

                          <Box>
                            <InputSelect
                              sx={{ width: 208 }}
                              label='Filter Status'
                              options={[
                                {
                                  label: 'All Status', value: 'all-status'
                                },
                                {
                                  label: 'Pending', value: 'pending'
                                },
                                {
                                  label: 'Refunded', value: 'refunded'
                                },
                                {
                                  label: 'Failed', value: 'failed'
                                },
                                {
                                  label: 'Sold', value: 'sold'
                                }
                              ]}
                              defaultValue={statusInputValue}
                              onChange={handleFilterStatusChange}
                            />
                          </Box>

                          <Box>
                            <Input
                              inputRef={searchInputRef}
                              defaultValue={searchInputValue}
                              name='search'
                              label='Search'
                              onChange={e => handleSearchChange(e.target.value)}
                            />
                          </Box>
                        </>
                      ),
                      rowActions: (row) => (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            gap: 2
                          }}
                        >
                          {
                            ['pending', 'failed'].includes(row.status) && (performanceDetails.status == 'Pending For Barcode Generation') && (
                              <>
                                <IconButton color='info' onClick={(e) => handleEdit(e, row)}>
                                  <Edit />
                                </IconButton>

                                <IconButton color='error' onClick={(e) => handleConfirm(e, 'Delete', row)}>
                                  <Delete />
                                </IconButton>
                              </>
                            )
                          }
                        </Box>
                      )
                    }}/>
                  )}

                  {isAddFormOpen && (
                    <AddParticipantsForm {...{
                      performanceCode,
                      isAddFormOpen,
                      setIsAddFormOpen,
                      fetchParticipants,
                      performanceDetails,
                      loading,
                      dispatch
                    }} />
                  )}

                  {isEditFormOpen && (
                    <EditParticipantsForm {...{
                      performanceCode,
                      isEditFormOpen,
                      setIsEditFormOpen,
                      fetchParticipants,
                      loading,
                      dispatch,
                      selectedRow,
                      performanceDetails
                    }}/>
                  )}

                  <Modal {...{
                    title: confirmMode,
                    isOpen: isConfirmOpen,
                    handleClose: handleClose
                  }}>
                    <Box sx={{ mb: 2 }}>
                      {confirmationMessage}
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        gap: 1
                      }}
                    >
                      <Button variant='label' label='No' onClick={() => handleClose()}/>

                      <Button variant='label' label='Yes' onClick={() => handleYes()}/>
                    </Box>
                  </Modal>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}
    </Grid>
  </>;
};

export default PerformanceDetailsPage;