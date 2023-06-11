import {getFormattedDate} from './utils/util.js';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const MODEL_DATE_FORMAT = 'YYYY-MM-DDTHH:mm';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const defaultPoint = () => Object.assign({}, {
  'id': 0,
  'type': 'taxi',
  'base_price': 0,
  'date_from': getFormattedDate(),
  'date_to': getFormattedDate(),
  'destination': 1,
  'offers': [],
});
export {POINT_TYPES, MODEL_DATE_FORMAT, FilterType, SortType, UserAction, UpdateType, defaultPoint};
