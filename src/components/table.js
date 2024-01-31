import React, { Fragment } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { createSelector } from 'reselect';

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
  Paper
} from '@mui/material';
import {
  setTablePageAction,
  setTablePageSizeAction,
  setTableSelectedIdsAction
} from '../redux-saga/actions';
import Loading from './loading';
import EmptyBanner from './empty-banner';

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
  onSelectAllClick,
  numSelected,
  rowCount
}) => {
  return <>
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>

        {headers.map((header, index) => (
          <Fragment key={index}>
            {header.rowId !== 'id' && (
              <TableCell
                key={header.id}
                align={'left'}
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

const RenderRows = ({ row, header }) => {
  if (!row[header.rowId]) {
    return '--';
  }

  return row[header.rowId];
};

const Table = ({
  headers,
  rows = [],
  loading = false
}) => {
  const dispatch = useDispatch();

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
            {rows.length > 0
              ? (
                <>
                  <TableContainer>
                    <MUITable
                      size='small'
                      stickyHeader
                    >
                      <RenderTableHead {...{
                        headers,
                        onSelectAllClick: handleSelectAllClick,
                        numSelected: selectedIds.length,
                        rowCount: rows.length
                      }}/>

                      <TableBody>
                        {rows.map((row, index) => (
                          <Fragment key={index}>
                            <TableRow
                              hover
                              onClick={(e) => handleClick(e, row.id)}
                              role="checkbox"
                              aria-checked={isSelected(row.id)}
                              tabIndex={-1}
                              key={row.id}
                              selected={isSelected(row.id)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  checked={isSelected(row.id)}
                                  inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${index}` }}
                                />
                              </TableCell>

                              {headers.map((header, headerIndex) => (
                                <Fragment key={headerIndex}>
                                  <TableCell>
                                    <RenderRows {...{
                                      row,
                                      header
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

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={pageSize}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
              )
              : (
                <Box sx={{ height: 420 }}>
                  <EmptyBanner/>
                </Box>
              )
            }
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