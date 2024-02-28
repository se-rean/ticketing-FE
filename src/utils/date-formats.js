import moment from 'moment';

export const dateTime = (datetime, offset = 4) => {
  // if (offset) {
  // return moment(datetime).utcOffset(offset).format('DD, MMMM, YYYY h:mm A');
  // } else {
  return moment(datetime).utcOffset(offset).format('DD MMMM, YYYY h:mm A');
  // }

};

export const YYYYMMDD = (date) => {
  return moment(date).format();
};