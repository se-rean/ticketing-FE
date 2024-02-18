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
  setTableSelectedIdsAction,
  updateEventsAction
} from '../../../redux-saga/actions';
import { TICKETING_EVENTS_TABLE_HEADERS } from '../../../utils/constants';
import { useNavigate } from 'react-router-dom';
import {
  debounce, isEmpty
} from 'lodash';

import {
  Add, CheckCircleOutline, DoDisturb, Launch
} from '@mui/icons-material';
import {
  Box, IconButton, Tooltip
} from '@mui/material';
import Button from '../../../components/button';
import Table from '../../../components/table';
import Input from '../../../components/input';
import Modal from '../../../components/modal';

const stateSelectors = createSelector(
  state => state.ticket,
  (ticket) => ({
    loading: ticket.loading,
    events: ticket.events
  })
);

const EventsPage = () => {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);
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

  const handleConfirm = (event, mode, row = null) => {
    event.stopPropagation();
    setIsConfirmOpen(!isConfirmOpen);
    setConfirmMode(mode);
    if (!isEmpty(row)) {
      setSelectedRow(row);
      dispatch(setTableSelectedIdsAction([]));
      dispatch(setTableSelectedIdsAction([row.id]));
    }
  };

  const handleUpdateStatus = () => {
    let status;
    const performanceCode = selectedRow.performance_code;
    switch(confirmMode) {
      case 'Completed':
        status = 2;
        break;
      case 'Reopen':
        status = 1;
        break;
      case 'Cancelled':
        status = 3;
        break;
      default:
        return;
    }

    const payload = {
      performanceCode,
      data: { status }
    };

    dispatch(updateEventsAction(payload)).then(() => {
      dispatch(getEventsAction());
    });
  };

  const handleYes = () => {
    handleUpdateStatus();
    setIsConfirmOpen(!isConfirmOpen);
  };

  useEffect(() => {
    dispatch(getEventsAction());
  }, []);

  return <>
    <Box sx={{ mb: 2 }} align='right'>
      <Button
        startIcon={<Add/>}
        label='Add Event'
        onClick={() => navigate('/admin/events/add')}
      />
    </Box>

    <Box>
      <Table {...{
        loading,
        headers: TICKETING_EVENTS_TABLE_HEADERS,
        headerActions: (
          <>
            <Box></Box>
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
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                gap: 2
              }}
            >
              <Tooltip title='Completed'>
                <IconButton color='success' onClick={(e) => handleConfirm(e, 'Completed', row)}>
                  <CheckCircleOutline/>
                </IconButton>
              </Tooltip>

              <Tooltip title='Reopen'>
                <IconButton color='warning' onClick={(e) => handleConfirm(e, 'Reopen', row)}>
                  <Launch/>
                </IconButton>
              </Tooltip>

              <Tooltip title='Cancelled'>
                <IconButton color='error' onClick={(e) => handleConfirm(e, 'Cancelled', row)}>
                  <DoDisturb/>
                </IconButton>
              </Tooltip>
            </Box>
          </>
        ),
        rows: events,
        hasSelectMultiple: false
      }}/>


      <Modal {...{
        title: confirmMode,
        isOpen: isConfirmOpen,
        handleClose: () => {
          dispatch(setTableSelectedIdsAction([]));
          setIsConfirmOpen(false);
        }
      }}>
        <Box sx={{ mb: 2 }}>
          {`Are you sure you want to update the status of the selected row into ${confirmMode}?`}
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
    </Box>
  </>;
};

export default EventsPage;