import { sort } from '../utils/sort.js';

export const generateSort = (points) => Object.entries(sort).map(
  ([sortName, sortPoints]) => ({
    name: sortName,
    count: sortPoints(points).length,
  }),
);
