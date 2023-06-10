import {render} from '../render.js';
import PointListView from '../view/point-list-view.js';
import PointListSortView from '../view/point-list-sort-view.js';
import PointItemView from '../view/point-item-view.js';
import PointListFormView from '../view/point-list-form-view.js';
import EmptyPointListView from '../view/point-list-empty-view.js';

export default class TripPointsPresenter {
  #pointListComponent = new PointListView();
  #container = null;
  #pointsModel = null;
  #pointList = [];

  #renderListItemComponent = (point) => {
    const pointComponent = new PointItemView(point);
    const formComponent = new PointListFormView(point);

    const closeEditFormOnEcsapeKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.#pointListComponent.element.replaceChild(pointComponent.element, formComponent.element);
        document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      this.#pointListComponent.element.replaceChild(formComponent.element, pointComponent.element);
      document.body.addEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    formComponent.element.querySelector('.event__save-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      this.#pointListComponent.element.replaceChild(pointComponent.element, formComponent.element);
      document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    formComponent.element.querySelector('.event__reset-btn').addEventListener('click', () => {
      this.#pointListComponent.element.replaceChild(pointComponent.element, formComponent.element);
      document.body.removeEventListener('keydown', closeEditFormOnEcsapeKey);
    });

    render(pointComponent, this.#pointListComponent.element);
  };

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#pointList = [...this.#pointsModel.points];
  }

  init() {
    render(new PointListSortView(), this.#container);
    render(this.#pointListComponent, this.#container);
    if (this.#pointList.length === 0) {
      render(new EmptyPointListView(), this.#container);
    } else {
      for (const point of this.#pointList) {
        this.#renderListItemComponent(point);
      }
    }
  }
}
