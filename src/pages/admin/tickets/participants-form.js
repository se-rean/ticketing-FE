/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import {
  createParticipantsBarcodeAction, getParticipantsAction
} from '../../../redux-saga/actions';
import { TICKETING_TABLE_HEADERS } from '../../../utils/constants';
import { exportToCSV } from '../../../helpers';

import {
  Grid, IconButton, Tooltip
} from '@mui/material';
import {
  Add,
  Download,
  QrCode2,
  Replay
} from '@mui/icons-material';
import Table from '../../../components/table';

const stateSelectors = createSelector(
  state => state.ticket,
  state => state.table,
  (ticket, table) => ({
    loading: ticket.loading,
    participants: ticket.participants,
    page: table.page,
    pageSize: table.pageSize,
    selectedTableRows: table.selectedIds
  })
);

const ParticipantsForm = ({ goToStep1 }) => {
  const dispatch = useDispatch();

  const {
    loading,
    participants,
    selectedTableRows,
    page,
    pageSize
  } = useSelector(stateSelectors);

  const performanceCode = sessionStorage.getItem('performanceCode');

  useEffect(() => {
    dispatch(getParticipantsAction({
      performanceCode: performanceCode,
      page: page + 1,
      pageSize
    }));
  }, [page, pageSize]);

  const handleGenerateBarcode = () => {
    const payload = {
      participantsIds: [],
      performanceCode: performanceCode
    };

    dispatch(createParticipantsBarcodeAction(payload));
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
          const { performanceCode } = payload;

          const mappedResult = result.map(i => ({
            Name: `${i.firstname} ${i.lastname}`,
            Nationality: i.nationality,
            Type: i.pricetype_code,
            ['Perfomance Code']: i.performance_code,
            Price: i.total_amount,
            Barcode: i.barcode
          }));

          exportToCSV(mappedResult, performanceCode);
        }
      });
  };

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Table {...{
          headers: TICKETING_TABLE_HEADERS,
          rows: participants,
          headerActions: (
            <>
              <Tooltip title='Generate Barcode'>
                <IconButton onClick={() => handleGenerateBarcode()}>
                  <QrCode2/>
                </IconButton>
              </Tooltip>

              <Tooltip title='Process Refund'>
                <IconButton disabled={selectedTableRows.length === 0}>
                  <Replay/>
                </IconButton>
              </Tooltip>

              <Tooltip title='Download Participants'>
                <IconButton onClick={() => handleDownloadParticipants()}>
                  <Download/>
                </IconButton>
              </Tooltip>

              <Tooltip title='Create New Event'>
                <IconButton onClick={() => goToStep1()}>
                  <Add/>
                </IconButton>
              </Tooltip>
            </>
          ),
          loading
        }}/>
      </Grid>
    </Grid>
  </>;
};

export default ParticipantsForm;