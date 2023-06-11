import {remove, render, RenderPosition} from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #destroyCallback = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView();
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#pointListContainer.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: 4, ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
