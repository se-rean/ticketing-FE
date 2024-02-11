/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState
} from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import { getEventsAction } from '../../../redux-saga/actions';
import { TICKETING_EVENTS_TABLE_HEADERS } from '../../../utils/constants';
import { useNavigate } from 'react-router-dom';

import { Add } from '@mui/icons-material';
import { Box } from '@mui/material';
import Button from '../../../components/button';
import Table from '../../../components/table';

const stateSelectors = createSelector(
  state => state.ticket,
  (ticket) => ({
    loading: ticket.loading,
    events: ticket.events
  })
);

const TicketsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    events
  } = useSelector(stateSelectors);

  useEffect(() => {
    dispatch(getEventsAction());
  }, []);

  return <>
    <Box sx={{ mb: 2 }} align='right'>
      <Button
        startIcon={<Add/>}
        label='Add Event'
        onClick={() => navigate('/admin/tickets/create-event')}
      />
    </Box>

    <Box>
      <Table {...{
        loading,
        headers: TICKETING_EVENTS_TABLE_HEADERS,
        rows: events,
        link: true
      }}/>
    </Box>
  </>;
};

export default TicketsPage;