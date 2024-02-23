import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import { getLogsAction } from '../../../redux-saga/actions';
import { debounce } from 'lodash';
import { LOGS_TABLE_HEADERS } from '../../../utils/constants';

import { Box } from '@mui/material';
import Table from '../../../components/table';
import Input from '../../../components/input';
import InputSelect from '../../../components/input-select';

const stateSelectors = createSelector(
  state => state.logs,
  state => state.table,
  (logs, table) => ({
    loading: logs.loading,
    logsData: logs.data,
    page: table.page,
    pageSize: table.pageSize,
    totalTableRows: table.totalTableRows
  })
);
const LogsPage = () => {
  const [typeInputValue, setTypeInputValue] = useState('All Actions');
  const [searchInputValue, setSearchInputValue] = useState('');
  const searchInputRef = useRef(null);

  const dispatch = useDispatch();

  const {
    loading,
    logsData,
    page,
    pageSize,
    totalTableRows
  } = useSelector(stateSelectors);

  const fetchLogs = () => {
    dispatch(getLogsAction({
      page: page + 1,
      pageSize,
      type: typeInputValue
    }));
  };

  const handleTypeChange = (e) => {
    setTypeInputValue(e.target.value);
  };

  const searchCallBack = (value) => {
    setSearchInputValue(value);
    dispatch(getLogsAction({
      page: page + 1,
      pageSize,
      type: typeInputValue,
      search: value
    }));

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const debouncedHandleInputChange = debounce(searchCallBack, 500);

  const handleSearchChange = (value) => {
    debouncedHandleInputChange(value);
  };

  useEffect(() => {
    fetchLogs();
  }, [page, pageSize, typeInputValue]);

  return <>
    <Table
      {...{
        headers: LOGS_TABLE_HEADERS,
        rows: logsData,
        totalTableRows,
        headerActions: (
          <>
            <Box>
              <InputSelect
                sx={{ width: 208 }}
                label='Action'
                options={[
                  {
                    label: 'All Actions', value: 'All Actions'
                  },
                  {
                    label: 'Login', value: 'Login'
                  },
                  {
                    label: 'Event Creation and Modification', value: 'Event Creation and Modification'
                  },
                  {
                    label: 'Participant Actions', value: 'Participant Actions'
                  },
                  {
                    label: 'Ticketing Actions', value: 'Ticketing Actions'
                  },
                  {
                    label: 'User', value: 'User'
                  }
                ]}
                defaultValue={typeInputValue}
                onChange={handleTypeChange}
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
        hasSelectMultiple: false,
        loading
      }}
    />
  </>;
};

export default LogsPage;