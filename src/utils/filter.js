import { FilterType } from '../const.js';
import { isEventUpcoming } from './util.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventUpcoming(point.date_from)),
};
