import React, { Fragment } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';
import Barcode from 'react-barcode';
import { dateTime } from '../utils/date-formats';

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
  Tooltip
} from '@mui/material';
import {
  setTablePageAction,
  setTablePageSizeAction,
  setTableSelectedIdsAction
} from '../redux-saga/actions';
import Loading from './loading';
import EmptyBanner from './empty-banner';
import StatusChip from './status-chip';
import { Info } from '@mui/icons-material';

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
  onSelectAllClick,
  numSelected,
  rowCount
}) => {
  return <>
    <TableHead>
      <TableRow>
        {headerActions && (
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
            {header.rowId !== 'id' && (
              <TableCell
                key={header.id}
                align='left'
              >
                {header.label}
              </TableCell>
            )}
          </Fragment>
        ))}
      </TableRow>
    </TableHead>
  </>;
};

// const RenderTableToolbar = () => {
//   return <>
//   </>;
// };

const RenderRows = ({ row, header, rowActions }) => {
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
    return dateTime(row[header.rowId]);
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
  rowActions = null,
  loading = false
}) => {
  const dispatch = useDispatch();

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

  return <>
    <Paper sx={{ p: 1 }}>
      {!loading
        ? (
          <>
            {headerActions && (
              <Box
                sx={{
                  py: 1,
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                {headerActions}
              </Box>
            )}

            <TableContainer>
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
                  rowCount: rows.length
                }}/>

                <TableBody>
                  {rows.map((row, index) => (
                    <Fragment key={index}>
                      <TableRow
                        hover={headerActions}
                        onClick={(e) => headerActions
                          ? handleClick(e, row.id)
                          : null}
                        role="checkbox"
                        aria-checked={isSelected(row.id)}
                        tabIndex={-1}
                        key={row.id}
                        selected={isSelected(row.id)}
                        sx={{ cursor: headerActions ? 'pointer' : '' }}
                      >
                        {headerActions && (
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
                                rowActions
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

            {rows.length === 0 && (
              <Box sx={{ height: 300 }}>
                <EmptyBanner/>
              </Box>
            )}

            <TablePagination
              rowsPerPageOptions={[10, 100, 500, 1000, 2000, 3000]}
              component="div"
              count={totalTableRows || rows.length}
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