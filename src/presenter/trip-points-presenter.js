import { render } from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyPointListView from '../view/point-list-empty-view.js';
import { generateSort } from '../mock/sort.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/util.js';

export default class TripPointsPresenter {
  #container = null;
  #pointsModel = null;

  #pointListComponent = new PointListView();
  #sortComponent = new SortView();
  #noPointsComponent = new EmptyPointListView();
  #pointList = [];
  #pointPresenter = new Map();

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointList = [...this.#pointsModel.points];
    this.#sortComponent.sorts = generateSort(this.#pointList);
    this.#renderMain();
  }

  #renderMain = () => {
    if (this.#pointList.length === 0) {
      render(this.#noPointsComponent, this.#container);
      return;
    }

    this.#renderSort();
    this.#renderList();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointList = updateItem(this.#pointList, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#container);
  };

  #renderList = () => {
    render(this.#pointListComponent, this.#container);
    this.#pointList.forEach((point) => this.#renderListItemComponent(point));
  };

  #renderListItemComponent = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };
}
