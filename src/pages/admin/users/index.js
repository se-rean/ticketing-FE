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
  deleteUsersAction,
  getUsersAction,
  setTableSelectedIdsAction
} from '../../../redux-saga/actions';
import { USERS_TABLE_HEADERS } from '../../../utils/constants';
import {
  debounce,
  isEmpty
} from 'lodash';

import {
  Add,
  Delete,
  Edit
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import Button from '../../../components/button';
import Table from '../../../components/table';
import Modal from '../../../components/modal';
import Input from '../../../components/input';

const stateSelectors = createSelector(
  state => state.users,
  state => state.table,
  (users, table) => ({
    loading: users.loading,
    users: users.data,
    selectedTableIds: table.selectedIds
  })
);

const UsersPage = () => {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const searchInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    users,
    selectedTableIds
  } = useSelector(stateSelectors);

  const searchCallBack = (value) => {
    setSearchInputValue(value);

    let newUsers = [...users];
    const searchValue = value.toLowerCase();
    const filter = newUsers.filter(i =>
      i.fullName.toLowerCase().includes(searchValue)
      || i.username.toLowerCase().includes(searchValue)
      || i.email.toLowerCase().includes(searchValue)
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
    if (confirmMode === 'Delete') {
      const payload = { id: selectedTableIds[0] };
      dispatch(deleteUsersAction(payload));
    }

    setIsConfirmOpen(!isConfirmOpen);
  };

  const handleEdit = (e, row) => {
    navigate(`/admin/users/edit/${row.id}`);
  };

  useEffect(() => {
    dispatch(getUsersAction());
  }, []);

  useEffect(() => {
    setTableRows(users);
  }, [users]);

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
        rows: tableRows,
        headers: USERS_TABLE_HEADERS,
        loading,
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
              <Tooltip title='Edit'>
                <IconButton color='info' onClick={(e) => handleEdit(e, row)}>
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