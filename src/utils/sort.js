import dayjs from 'dayjs';
import { SortType } from '../const.js';

export const sort = {
  [SortType.DAY]: (points) => points,
  [SortType.EVENT]: (points) => points,
  [SortType.TIME]: (points) => points,
  [SortType.PRICE]: (points) => points,
  [SortType.OFFERS]: (points) => points,
};

export const sortPointsByDay = (pa, pb) => dayjs(pa.date_from).toDate() - dayjs(pb.date_from).toDate();
export const sortPointsByPrice = (pa, pb) => pb.base_price - pa.base_price;
