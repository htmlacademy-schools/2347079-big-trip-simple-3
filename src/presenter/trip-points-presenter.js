import { render } from '../framework/render.js';
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

    const replacePointToForm = () => {
      this.#pointListComponent.element.replaceChild(formComponent.element, pointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#pointListComponent.element.replaceChild(pointComponent.element, formComponent.element);
    };

    const onEscKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        replaceFormToPoint();
        document.body.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setEditButtonClickHandler(() => {
      replacePointToForm();
      document.body.addEventListener('keydown', onEscKeyDown);
    });

    formComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.body.removeEventListener('keydown', onEscKeyDown);
    });

    formComponent.setFormResetHandler(() => {
      replaceFormToPoint();
      document.body.removeEventListener('keydown', onEscKeyDown);
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
