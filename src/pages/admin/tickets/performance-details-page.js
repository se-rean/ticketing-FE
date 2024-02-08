/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {
  Fragment,
  useState,
  useEffect
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
  YYYYMMDD, dateTime
} from '../../../utils/date-formats';
import { TICKETING_TABLE_HEADERS } from '../../../utils/constants';
import {
  toastError,
  exportToCSV,
  toastSuccess
} from '../../../helpers';
import * as XLSX from 'xlsx';
import {
  isEmpty,
  map,
  zipObject
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
  Popper,
  Fade,
  Paper,
  MenuList,
  MenuItem,
  ClickAwayListener
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
import Button from '../../../components/button';
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
    totalTableRows: table.totalTableRows
  })
);

const PerformanceDetailsPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState(false);

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
    totalTableRows
  } = useSelector(stateSelectors);

  const fetchParticipants = () => {
    dispatch(getParticipantsAction({
      performanceCode: performanceCode,
      page: page + 1,
      pageSize
    }));
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
          const ticketPrice = performanceDetails.event_pricing.find(pricing => pricing.type_code === item['pricetypecode']).amount;

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
          dispatch(getParticipantsAction({
            performanceCode,
            page: page + 1,
            pageSize
          }));
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
        dispatch(getParticipantsAction({
          performanceCode: performanceCode,
          page: page + 1,
          pageSize
        }));
      });
  };

  const handleDownloadParticipants = () => {
    const payload = {
      performanceCode: performanceCode,
      page: 1,
      pageSize: 1000000
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
      dispatch(setTableSelectedIdsAction([]));
      dispatch(setTableSelectedIdsAction([row.id]));
    }
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
      dispatch(setTableSelectedIdsAction([]));
      dispatch(setTableSelectedIdsAction([row.id]));
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

  useEffect(() => {
    dispatch(getPerformanceDetailsAction(performanceCode));
  }, []);

  useEffect(() => {
    fetchParticipants();
  }, [page, pageSize]);

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

      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography color='primary'>
                <strong>Participants</strong>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Table {...{
                id: 'performance-details-table',
                loading: participantsLoading,
                headers: TICKETING_TABLE_HEADERS,
                rows: participants,
                totalTableRows,
                headerActions: (
                  <>
                    <Tooltip title='Generate Barcode'>
                      <IconButton onClick={(e) => handleConfirm(e, 'Generate Barcode')} disabled={isEmpty(participants)}>
                        <QrCode/>
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Process Refund'>
                      <IconButton color='warning' onClick={(e) => handleConfirm(e, 'Refund')} disabled={selectedTableIds.length === 0}>
                        <Replay/>
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Export to Excel'>
                      <IconButton color='success' onClick={(e) => handleConfirm(e, 'Export to Excel')} disabled={isEmpty(participants)}>
                        <Download/>
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Import Excel'>
                      <IconButton color='success' component="label">
                        <Upload/>

                        <input
                          id='import-input'
                          type='file'
                          hidden
                          accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv,'
                          onChange={handleUploadFile}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Add Participants'>
                      <IconButton color='primary'>
                        <Add/>
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Create New Event'>
                      <IconButton color='primary' onClick={() => navigate('/admin/tickets/create-event')}>
                        <Event/>
                      </IconButton>
                    </Tooltip>
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
                    <IconButton color='info' onClick={(e) => handleEdit(e, row)}>
                      <Edit/>
                    </IconButton>

                    <IconButton color='error' onClick={(e) => handleConfirm(e, 'Delete', row)}>
                      <Delete/>
                    </IconButton>
                  </Box>
                )
              }}/>

              <Modal {...{
                title: confirmMode,
                isOpen: isConfirmOpen,
                handleClose: () => setIsConfirmOpen(false)
              }}>
                <Box sx={{ mb: 2 }}>
                  Are you sure you want to {confirmMode}?
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    gap: 1
                  }}
                >
                  <Button variant='label' label='No' onClick={() => setIsConfirmOpen(false)}/>

                  <Button variant='label' label='Yes' onClick={() => handleYes()}/>
                </Box>
              </Modal>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  </>;
};

export default PerformanceDetailsPage;