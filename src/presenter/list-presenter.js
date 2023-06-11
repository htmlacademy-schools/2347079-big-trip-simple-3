import { RenderPosition, render, remove } from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyPointListView from '../view/point-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { sortPointsByDay, sortPointsByPrice } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';

export default class ListPresenter {
  #container = null;

  #pointsModel = null;
  #filterModel = null;

  #pointListComponent = new PointListView();
  #sortComponent = null;
  #noPointsComponent = null;

  #pointPresenter = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor(container, filterModel, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new NewPointPresenter(this.#pointListComponent, this.#handleViewAction);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderMain();
  }

  createPoint = (callback) => {
    if (this.#pointsModel.points.length !== 0) {
      this.#currentSortType = SortType.DAY;
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      this.#newPointPresenter.init(callback);
    } else {
      remove(this.#noPointsComponent);
      render(this.#pointListComponent, this.#container);
      this.#newPointPresenter.init(callback);
    }
  };

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortPointsByDay);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
    }
    return filteredPoints;
  }

  #renderMain = () => {
    if (this.points.length === 0) {
      this.#renderIfEmpty();
      return;
    }

    this.#renderSort();
    render(this.#pointListComponent, this.#container);
    this.points.forEach((point) => this.#renderListItemComponent(point));
  };

  #renderIfEmpty = () => {
    this.#noPointsComponent = new EmptyPointListView(this.#filterType);
    render(this.#noPointsComponent, this.#container);
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearAll();
        this.#renderMain();
        break;
      case UpdateType.MAJOR:
        this.#clearAll({resetSortType: true});
        this.#renderMain();
        break;
    }
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearAll();
    this.#renderMain();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #renderListItemComponent = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #clearAll = ({resetSortType = false} = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };
}
