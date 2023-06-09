import FilterFormView from './view/filter-form-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import {render} from './render.js';

const filterFormContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const tripEventsPresenter = new TripEventsPresenter();
tripEventsPresenter.init(tripEventsContainer);

render(new FilterFormView(), filterFormContainer);
