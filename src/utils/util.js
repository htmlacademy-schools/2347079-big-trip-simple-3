import dayjs from 'dayjs';

export const getRandomInt = (upperBound = 100) => (Math.floor(Math.random() * upperBound));
export const getFormattedDate = (eventDate, format) => dayjs(eventDate).format(format);
export const isEventUpcoming = (date) => !dayjs(date).isBefore(dayjs(), 'D');
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
