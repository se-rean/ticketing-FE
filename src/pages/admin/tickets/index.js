/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState,
  useRef
} from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import {
  getEventsAction,
  setEventsAction
} from '../../../redux-saga/actions';
import { TICKETING_EVENTS_TABLE_HEADERS } from '../../../utils/constants';
import { useNavigate } from 'react-router-dom';
import {
  debounce, isEmpty
} from 'lodash';

import { Add } from '@mui/icons-material';
import { Box } from '@mui/material';
import Button from '../../../components/button';
import Table from '../../../components/table';
import Input from '../../../components/input';

const stateSelectors = createSelector(
  state => state.ticket,
  (ticket) => ({
    loading: ticket.loading,
    events: ticket.events
  })
);

const TicketsPage = () => {
  const [searchInputValue, setSearchInputValue] = useState('');
  const searchInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    events
  } = useSelector(stateSelectors);

  const searchCallBack = (value) => {
    setSearchInputValue(value);
    dispatch(getEventsAction({ search: value }));

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const debouncedHandleInputChange = debounce(searchCallBack, 500);

  const handleSearchChange = (value) => {
    debouncedHandleInputChange(value);
  };

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
        headerActions: (
          <Box
            sx={{
              p: 1,
              display: 'flex',
              justifyContent: 'end',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            <Box>
              <Input
                inputRef={searchInputRef}
                defaultValue={searchInputValue}
                name='search'
                label='Search'
                onChange={e => handleSearchChange(e.target.value)}
              />
            </Box>
          </Box>
        ),
        rows: events,
        hasSelectMultiple: false
      }}/>
    </Box>
  </>;
};

export default TicketsPage;