import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { RenderPosition, render, remove } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import PointListView from '../view/point-list-view.js';
import EmptyPointListView from '../view/point-list-empty-view.js';
import LoadingView from '../view/loading-view.js';
import SortView from '../view/sort-view.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { sortPointsByDay, sortPointsByPrice } from '../utils/sort.js';
import { filter } from '../utils/filter.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class ListPresenter {
  #container = null;
  #pointListComponent = new PointListView();
  #sortComponent = null;
  #noPointsComponent = null;
  #loadingComponent = new LoadingView();

  #pointsModel = null;
  #filterModel = null;

  #pointPresenter = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, filterModel, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new NewPointPresenter(this.#pointListComponent, this.#handleViewAction);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

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

  init() {
    this.#renderMain();
  }

  #renderMain = () => {
    render(this.#pointListComponent, this.#container);
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
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

  #renderLoading = () => {
    render(this.#loadingComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #renderListItemComponent = (point) => {
    const pointPresenter = new PointPresenter(
      this.#pointListComponent,
      this.#handleViewAction,
      this.#handleModeChange);
    pointPresenter.init(point, this.#pointsModel.offers, this.#pointsModel.destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  createPoint = (callback) => {
    if (this.#pointsModel.points.length !== 0) {
      this.#currentSortType = SortType.DAY;
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      this.#newPointPresenter.init(callback, this.#pointsModel.offers, this.#pointsModel.destinations);
    } else {
      remove(this.#noPointsComponent);
      render(this.#pointListComponent, this.#container);
      this.#newPointPresenter.init(callback);
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #clearAll = ({resetSortType = false} = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };
}
