import dayjs from 'dayjs';
import { MODEL_DATE_FORMAT } from '../const';

export const getRandomInt = (upperBound = 100) => (Math.floor(Math.random() * upperBound));
export const getFormattedDate = (eventDate, format = MODEL_DATE_FORMAT) => dayjs(eventDate).format(format);
export const turnModelDateToFramework = (date) => dayjs(date).format('DD/MM/YY HH:mm');
export const isEventUpcoming = (date) => !dayjs(date).isBefore(dayjs(), 'day');
export const compareDates = (a, b) => dayjs(a).diff(dayjs(b)) < 0;
export const validateNumber = (num) => {
  if (isNaN(num)) {
    return 0;
  } else if (num >= 0) {
    return num;
  }
  return -num;
};
export const getMockText = (len) => {
  const mockText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
  est laborum.`;
  return mockText.slice(0, len);
};

export const getIdFromTag = (tag) => +tag.id.split('-').slice(-1);
