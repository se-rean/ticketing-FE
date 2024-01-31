import moment from 'moment';

export const dateTime = (datetime) => {
  return moment(datetime).format('MMMM DD, YYYY h:mm A');
};