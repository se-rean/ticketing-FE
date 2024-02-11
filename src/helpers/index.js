import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { cloneDeep } from 'lodash';
import moment from 'moment';

export const getUser = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  return user ? user : {};
};

export const toastSuccess = message => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'colored'
  });
};

export const toastWarning = message => {
  toast.warn(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'colored'
  });
};

export const toastError = message => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'colored'
  });
};

export const toastInfo = message => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'colored'
  });
};

export const exportToCSV = (data, title) => {
  const xlsxData = cloneDeep(data);
  const worksheet = XLSX.utils.json_to_sheet(xlsxData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${title}-${moment(new Date()).format('YYYY-MM-DD')}.xlsx`);
};

export const numbersOnlyKeyPress = (e) => {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
};