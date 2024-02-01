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

const ParticipantsForm = () => {
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
      performanceCode: 'PDUB01DEC2023B', // performanceCode
      page: page + 1,
      pageSize
    }));
  }, [page, pageSize]);

  const handleGenerateBarcode = () => {
    const payload = {
      participantsIds: [],
      performanceCode: 'PDUB01DEC2023B' // performanceCode
    };

    dispatch(createParticipantsBarcodeAction(payload));
  };

  const handleDownloadParticipants = () => {
    const payload = {
      performanceCode: 'PDUB01DEC2023B', // performanceCode
      page: 1,
      pageSize: 1000000
    };

    dispatch(getParticipantsAction(payload))
      .then(({ payload: { data: { data: result } } }) => {
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
            </>
          ),
          loading
        }}/>
      </Grid>
    </Grid>
  </>;
};

export default ParticipantsForm;