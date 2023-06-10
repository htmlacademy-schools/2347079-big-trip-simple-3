import FilterFormView from './view/filter-view.js';
import TripPointsPresenter from './presenter/trip-points-presenter.js';
import {render} from './render.js';
import PointsModel from './model/point-model.js';

const filterFormContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const tripPointsPresenter = new TripPointsPresenter();
render(new FilterFormView(), filterFormContainer);
tripPointsPresenter.init(tripEventsContainer, pointsModel);
