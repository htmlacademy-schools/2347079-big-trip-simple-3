import FilterFormView from './view/filter-view.js';
import TripPointsPresenter from './presenter/trip-points-presenter.js';
import {render} from './framework/render.js';
import PointsModel from './model/point-model.js';
import { generateFilter } from './mock/filter.js';

const pointsModel = new PointsModel();
const filterFormContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const filters = generateFilter(pointsModel.points);

render(new FilterFormView(filters), filterFormContainer);
const tripPointsPresenter = new TripPointsPresenter(tripEventsContainer, pointsModel);

tripPointsPresenter.init();
