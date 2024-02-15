/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useState,
  useRef
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import {
  getUsersAction, setTableSelectedIdsAction
} from '../../../redux-saga/actions';
import { USERS_TABLE_HEADERS } from '../../../utils/constants';
import {
  debounce, isEmpty
} from 'lodash';

import {
  Add, Delete, Edit
} from '@mui/icons-material';
import {
  Box, IconButton, Tooltip
} from '@mui/material';
import Button from '../../../components/button';
import Table from '../../../components/table';
import Modal from '../../../components/modal';
import Input from '../../../components/input';

const stateSelectors = createSelector(
  state => state.users,
  (users) => ({
    loading: users.loading,
    users: users.data
  })
);

const UsersPage = () => {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState(false);
  const searchInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    users
  } = useSelector(stateSelectors);

  const searchCallBack = (value) => {
    setSearchInputValue(value);
    dispatch(getUsersAction({ search: value }));

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
      dispatch(setTableSelectedIdsAction([]));
      dispatch(setTableSelectedIdsAction([row.id]));
    }
  };

  const handleYes = () => {
    setIsConfirmOpen(!isConfirmOpen);
  };

  const handleEdit = () => {

  };

  useEffect(() => {
    dispatch(getUsersAction());
  }, []);

  return <>
    <Box sx={{ mb: 2 }} align='right'>
      <Button
        startIcon={<Add/>}
        label='Add User'
        onClick={() => navigate('/admin/users/add')}
      />
    </Box>

    <Box>
      <Table {...{
        rows: users,
        headers: USERS_TABLE_HEADERS,
        loading,
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
        rowActions: (row) => (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                gap: 2
              }}
            >
              <Tooltip title='Complete'>
                <IconButton color='info' onClick={(e) => handleEdit()}>
                  <Edit/>
                </IconButton>
              </Tooltip>

              <Tooltip title='Cancel'>
                <IconButton color='error' onClick={(e) => handleConfirm(e, 'Delete', row)}>
                  <Delete/>
                </IconButton>
              </Tooltip>
            </Box>
          </>
        ),
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
          Are you sure you want to {confirmMode} the selected row?
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

export default UsersPage;