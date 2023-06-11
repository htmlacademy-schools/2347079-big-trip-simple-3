import { getRandomInt, getMockText } from '../utils/util.js';
import { POINT_TYPES } from '../const.js';
import dayjs from 'dayjs';

const generatePictures = () => {
  const res = new Array(getRandomInt(5));
  for (let i = 0; i < res.length; i++) {
    res[i] = {
      'src': `http://picsum.photos/300/200?r=${getRandomInt(Number.MAX_SAFE_INTEGER)}`,
      'description': getMockText(getRandomInt(50)),
    };
  }
  return res;
};

const mockDestinationNamesList = ['Amsterdam', 'Geneva', 'Chamonix'];
const destinationsStorage = {};
for (let i = 0; i < mockDestinationNamesList.length; i++) {
  destinationsStorage[i] = {
    'id': i,
    'description': getMockText(getRandomInt(200)),
    'name': mockDestinationNamesList[i],
    'pictures': generatePictures(),
  };
}

const numOfOffers = getRandomInt(7);
const offersStorage = {};
for (let i = 0; i < numOfOffers; i++) {
  offersStorage[i] = {
    'id': i,
    'title': `Offer #${i}`,
    'price': getRandomInt(100)
  };
}

const generateOffers = () => {
  const res = new Set();
  for (let i = 0; i < numOfOffers; i++) {
    if (getRandomInt() > 50) {
      res.add(i);
    }
  }
  return Array.from(res);
};

const generateType = () => POINT_TYPES[getRandomInt(POINT_TYPES.length)];

const generateDate = () => {
  const dateFrom = dayjs().add(getRandomInt(60), 'minute');
  const dateTo = dateFrom.add(getRandomInt(1000), 'minute');
  return {
    'date_from': dateFrom,
    'date_to': dateTo,
  };
};

const generatePoint = (id) => {
  const dates = generateDate();
  return {
    'id': id,
    'type': generateType(),
    'base_price': getRandomInt(1000),
    'date_from': dates.date_from,
    'date_to': dates.date_to,
    'destination': getRandomInt(Object.keys(destinationsStorage).length),
    'offers': generateOffers()
  };
};

export const generatePoints = (numOfPoints) => {
  const res = [];
  for (let i = 0; i < numOfPoints; i++) {
    res.push(generatePoint(i));
  }
  return res;
};

export const getDefaultPoint = () => (Object.assign({}, {
  'id': 0,
  'type': POINT_TYPES[0],
  'base_price': null,
  'date_from': dayjs(),
  'date_to': dayjs(),
  'destination': 0,
  'offers': [],
}));

export {destinationsStorage, offersStorage};
