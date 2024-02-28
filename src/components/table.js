/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  Fragment
} from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import Barcode from 'react-barcode';
import { dateTime } from '../utils/date-formats';
import { useNavigate } from 'react-router-dom';
import {
  setTablePageAction,
  setTablePageSizeAction,
  setTableSelectedIdsAction
} from '../redux-saga/actions';

import { Info } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import {
  Table as MUITable,
  TableContainer,
  TableBody,
  TablePagination,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Box,
  Paper,
  Tooltip,
  Typography,
  TableSortLabel
} from '@mui/material';
import Loading from './loading';
import EmptyBanner from './empty-banner';
import StatusChip from './status-chip';
import { isEmpty } from 'lodash';

const stateSelectors = createSelector(
  state => state.table,
  (table) => ({
    selectedIds: table.selectedIds,
    page: table.page,
    pageSize: table.pageSize
  })
);

const RenderTableHead = ({
  headers,
  headerActions,
  hasSelectMultiple,
  onSelectAllClick,
  numSelected,
  rowCount,
  onRequestSort,
  order,
  orderBy
}) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return <>
    <TableHead>
      <TableRow>
        {headerActions && hasSelectMultiple && (
          <TableCell
            padding='checkbox'
          >
            <Checkbox
              color='primary'
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}

        {headers.map((header, index) => (
          <Fragment key={index}>
            <TableCell
              key={header.rowId}
              align='left'
            >
              <TableSortLabel
                active={orderBy === header.rowId}
                direction={orderBy === header.rowId ? order : 'asc'}
                onClick={createSortHandler(header.rowId)}
              >
                {header.label}
                {orderBy === header.rowId ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          </Fragment>
        ))}
      </TableRow>
    </TableHead>
  </>;
};

const RenderRows = ({ row, header, rowActions, navigate }) => {
  if (!row[header.rowId] && header.type !== 'actions') {
    if (header.type === 'status' && row.generate_barcode_api_respose != 'OK' && row.generate_barcode_api_respose != null ) {
      const color = row.generate_barcode_api_respose != 'OK' ? 'red' : 'white';
      return <>
        <Tooltip title={row.generate_barcode_api_respose}>
          <Info sx={{ color }}/>
        </Tooltip>
      </>;
    }
    return '--';
  } else if (header.type === 'datetime') {
    if (header.timeZone) {
      return dateTime(row[header.rowId], header.timeZone);
    } else {
      return dateTime(row[header.rowId]);
    }

  } else if (header.type === 'status') {
    if (row[header.rowId].toUpperCase() === 'FAILED') {
      const color = row.generate_barcode_api_respose != 'OK' ? 'red' : 'white';
      return <>
        <Tooltip title={row.generate_barcode_api_respose}>
          <Info sx={{ color }}/>
        </Tooltip>
      </>;
    }

    return <>
      <StatusChip {...{ label: row[header.rowId].toUpperCase() }}/>
    </>;
  } else if (header.type === 'barcode') {
    return <>
      <Barcode fontSize={14} width={1} height={30} value={row[header.rowId]}/>
    </>;
  } else if (header.type === 'actions') {
    return <>
      {rowActions(row)}
    </>;
  } else if (header.type === 'link') {
    return <>
      <Typography>
        <span
          style={{
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          onClick={() => navigate(`/admin/events/performance-details/${row[header.rowId]}`)}
        >
          {row[header.rowId]}
        </span>
      </Typography>
    </>;
  } else {
    return row[header.rowId];
  }
};

const Table = ({
  id = '',
  headers: tableHeaders,
  rows = [],
  totalTableRows = null,
  headerActions = null,
  hasSelectMultiple = true,
  rowActions = null,
  loading = false
}) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(null);
  const [visibleRows, setVisibleRows] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const headers = [...tableHeaders];

  if (rowActions) {
    headers.push({
      rowId: 'actions',
      label: 'Actions',
      type: 'actions'
    });
  }

  const {
    selectedIds,
    page,
    pageSize
  } = useSelector(stateSelectors);

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      dispatch(setTableSelectedIdsAction(newSelected));
      return;
    }
    dispatch(setTableSelectedIdsAction([]));
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }

    dispatch(setTableSelectedIdsAction(newSelected));
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setTablePageAction(newPage));
    dispatch(setTableSelectedIdsAction([]));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setTablePageSizeAction(parseInt(event.target.value, 10)));
    dispatch(setTablePageAction(0));
    dispatch(setTableSelectedIdsAction([]));
  };

  const isSelected = (id) => selectedIds.indexOf(id) !== -1;

  useEffect(() => {
    setOrderBy(headers[0].rowId);
  }, []);

  useEffect(() => {
    if (!isEmpty(orderBy)) {
      setVisibleRows(
        stableSort(rows, getComparator(order, orderBy)).slice(
          page * pageSize,
          page * pageSize + pageSize
        ),
        [order, orderBy, page, pageSize]
      );
    }
  }, [rows, page, pageSize, order, orderBy]);

  return <>
    <Paper sx={{ p: 1 }}>
      {!loading
        ? (
          <>
            {headerActions && (
              <Box
                sx={{
                  px: 1,
                  py: 2,
                  display: 'flex',
                  justifyContent: 'end',
                  flexWrap: 'wrap',
                  gap: 1,
                  borderBottom: '1px solid rgba(224, 224, 224, 1)'
                }}
              >
                {headerActions}
              </Box>
            )}

            <TableContainer sx={{ height: visibleRows.length === 0 ? '' : 420 }}>
              <MUITable
                id={id}
                size='small'
                stickyHeader
                dense
              >
                <RenderTableHead {...{
                  headers,
                  headerActions,
                  onSelectAllClick: handleSelectAllClick,
                  numSelected: selectedIds.length,
                  rowCount: visibleRows.length,
                  hasSelectMultiple,
                  order,
                  orderBy,
                  onRequestSort: handleRequestSort
                }}/>

                <TableBody>
                  {visibleRows.map((row, index) => (
                    <Fragment key={index}>
                      <TableRow
                        hover={headerActions && hasSelectMultiple}
                        onClick={(e) => headerActions && hasSelectMultiple
                          ? handleClick(e, row.id)
                          : null}
                        role="checkbox"
                        aria-checked={isSelected(row.id)}
                        tabIndex={-1}
                        key={row.id}
                        selected={isSelected(row.id)}
                        sx={{ cursor: headerActions && hasSelectMultiple ? 'pointer' : '' }}
                      >
                        {headerActions && hasSelectMultiple && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isSelected(row.id)}
                              inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${index}` }}
                            />
                          </TableCell>
                        )}

                        {headers.map((header, headerIndex) => (
                          <Fragment key={headerIndex}>
                            <TableCell>
                              <RenderRows {...{
                                row,
                                header,
                                rowActions,
                                navigate
                              }}/>
                            </TableCell>
                          </Fragment>
                        ))}
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </MUITable>
            </TableContainer>

            {visibleRows.length === 0 && (
              <Box sx={{ height: 420 }}>
                <EmptyBanner/>
              </Box>
            )}

            <TablePagination
              rowsPerPageOptions={[10, 100, 500, 1000, 2000, 3000]}
              component="div"
              count={totalTableRows || visibleRows.length}
              rowsPerPage={pageSize}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )
        : (
          <Box sx={{ height: 420 }}>
            <Loading/>
          </Box>
        )
      }
    </Paper>
  </>;
};

export default Table;