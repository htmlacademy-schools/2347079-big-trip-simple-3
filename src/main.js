import FilterPresenter from './presenter/filter-presenter.js';
import ListPresenter from './presenter/list-presenter.js';
import {render} from './framework/render.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';


const tripEventsContainer = document.querySelector('.trip-events');
const filterFormContainer = document.querySelector('.trip-controls__filters');
const pageHeaderContainer = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const listPresenter = new ListPresenter(tripEventsContainer, filterModel, pointsModel);
const filterPresenter = new FilterPresenter(filterFormContainer, filterModel, pointsModel);

filterPresenter.init();
listPresenter.init();

const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  listPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, pageHeaderContainer);
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
