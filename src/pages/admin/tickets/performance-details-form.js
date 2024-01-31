/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, {
  Fragment,
  useState,
  useEffect
} from 'react';
import { useForm } from 'react-hook-form';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import { dateTime } from '../../../utils/date-formats';
import { toastError } from '../../../helpers';
import * as XLSX from 'xlsx';
import {
  map,
  zipObject
} from 'lodash';

import {
  Box,
  Card,
  Divider,
  Grid,
  Typography
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import Loading from '../../../components/loading';
import InputSelect from '../../../components/input-select';
import Button from '../../../components/button';
import { createParticipantAction } from '../../../redux-saga/actions';

const stateSelectors = createSelector(
  state => state.ticket,
  (ticket) => ({
    performanceDetails: ticket.performanceDetails,
    loading: ticket.loading,
    generateParticipantLoading: ticket.generateParticipantLoading,
    isSuccess: ticket.createParticipantsSuccess
  })
);

const PerformanceDetailsForm = ({ handleNextStep }) => {
  const [regParticipantInputValue, setRegParticipantInputValue] = useState('import-excel');
  const dispatch = useDispatch();

  const {
    loading,
    generateParticipantLoading,
    performanceDetails,
    isSuccess
  } = useSelector(stateSelectors);

  const {
    sections,
    price_types: priceTypes,
    ticket_prices: ticketPrices
  } = performanceDetails
    ? performanceDetails
    : {
      sections: null,
      price_types: null,
      ticket_prices: null
    };

  const handleRegisterOptionSelectChange = (e) => {
    setRegParticipantInputValue(e.target.value);
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];

    const acceptedFileTypes = 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const ACCEPT_TYPE_MAPPER = acceptedFileTypes.split(/[ ,]+/);

    if (!ACCEPT_TYPE_MAPPER.includes(file.type)) {
      toastError('Upload failed, the uploader accepts excel file only.');
    }

    readExcelData(file)
      .then((result) => {
        const keys = result[0];
        const zippedResult = map(result.slice(1), entry => zipObject(keys, entry));

        const payload = zippedResult.map(item => {
          const ticketPrice = performanceDetails.ticket_prices.find(i => i.type_code === item['pricetype code']).price;

          const newItems = {
            ...item,
            performance_code: item['Performance Code'],
            address_line_1: item['address line 1'],
            pricetype_code: item['pricetype code'],
            totalAmount: ticketPrice * item['quantity']
          };

          delete newItems['salutation'];
          delete newItems['Performance Code'];
          delete newItems['address line 1'];
          delete newItems['pricetype code'];

          return newItems;
        });

        dispatch(createParticipantAction(payload));
      })
      .catch((error) => {
        toastError(error);
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

  useEffect(() => {
    if (isSuccess) {
      handleNextStep();
    }
  }, [isSuccess]);

  let pricingDetails;
  if (sections && priceTypes && ticketPrices) {
    pricingDetails = sections.map(section => ({
      ...section,
      ticketPrice: ticketPrices.find(ticketPrice => ticketPrice.category_id === section.category_id),
      priceType: priceTypes.find(priceType => priceType.id === ticketPrices.find(ticketPrice => ticketPrice.category_id === section.category_id).type_id)
    }));
  }

  const IMPORT_EXCEL = 'import-excel';
  const RANDOM_PARTICIPANTS = 'random-participants';

  const registerParticipantsOptions = [
    {
      label: 'Import Excel', value: IMPORT_EXCEL
    },
    {
      label: 'Random Participants', value: RANDOM_PARTICIPANTS
    }
  ];

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} lg={8} xl={8}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              {!loading && performanceDetails
                ? (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography color='primary' variant='h6'>
                        Event Details
                      </Typography>
                    </Box>

                    <Grid container spacing={1}>
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
                              {performanceDetails.name}
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
                              {dateTime(performanceDetails.start_date)}
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
                              {dateTime(performanceDetails.end_date)}
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
                              {performanceDetails.venue_code}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )
                : (
                  <Loading/>
                )
              }
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              {!loading && performanceDetails && pricingDetails
                ? (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography color='primary' variant='h6'>
                        Price Details
                      </Typography>
                    </Box>

                    <Grid container spacing={1}>
                      {pricingDetails.map((i, index) => (
                        <Fragment key={index}>
                          <Grid item xs={12}>
                            <Grid container spacing={1}>
                              <Grid item xs={12}>
                                <Grid container spacing={0}>
                                  <Grid item xs={5} md={3} lg={3} xl={3}>
                                    <Typography variant='subtitle2'>{i.code}</Typography>
                                  </Grid>

                                  <Grid item xs={2} md={3} lg={3} xl={3}>
                                    <Typography variant='subtitle2'>{i.ticketPrice.type_code}</Typography>
                                  </Grid>

                                  <Grid item xs={3} md={3} lg={3} xl={3}>
                                    <Typography variant='subtitle2'>{i.ticketPrice.price}</Typography>
                                  </Grid>

                                  <Grid item xs={2} md={3} lg={3} xl={3}>
                                    <Typography variant='subtitle2'>{i.priceType.state}</Typography>
                                  </Grid>
                                </Grid>
                              </Grid>

                              {index !== pricingDetails.length - 1 && (
                                <Grid item xs={12}>
                                  <Divider/>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                        </Fragment>
                      ))}
                    </Grid>
                  </>
                )
                : (
                  <Loading/>
                )
              }
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} lg={4} xl={4}>
        <Card sx={{ p: 3 }}>
          {!loading && !generateParticipantLoading && performanceDetails
            ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography color='primary' variant='h6'>
                    Generate Participants
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <InputSelect
                      label='Register Option'
                      options={registerParticipantsOptions}
                      defaultValue={regParticipantInputValue}
                      onChange={(e) => handleRegisterOptionSelectChange(e)}
                    />
                  </Grid>

                  {regParticipantInputValue === IMPORT_EXCEL && (
                    <Grid item xs={12}>
                      <Button
                        sx={{ width: '100%' }}
                        component='label'
                        variant='contained'
                        startIcon={<CloudUpload/>}
                        color='success'
                        label='Upload File'
                      >
                        <input
                          type='file'
                          hidden
                          accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                          onChange={handleUploadFile}
                        />
                      </Button>
                    </Grid>
                  )}

                  {regParticipantInputValue === RANDOM_PARTICIPANTS && (
                    <Grid item xs={12}>
                      ON DEVELOPMENT
                    </Grid>
                  )}
                </Grid>
              </>
            )
            : (
              <Loading/>
            )
          }
        </Card>
      </Grid>
    </Grid>
  </>;
};

export default PerformanceDetailsForm;