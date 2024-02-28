import moment from 'moment';

export const dateTime = (datetime, offset = null) => {
  if (offset) {
    return moment(datetime).utcOffset(offset).format('MMMM DD, YYYY h:mm A');
  } else {
    return moment(datetime).format('MMMM DD, YYYY h:mm A');
  }

};

export const YYYYMMDD = (date) => {
  return moment(date).format();
};