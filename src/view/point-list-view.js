import AbstractView from '../framework/view/abstract-view.js';
import {createElement, render} from '../framework/render.js';

const createPointListTemplate = () =>
  `<ul class="trip-events__list">
  </ul>`;

const createPointListItemTemplate = () =>
  `<li class="trip-events__item">
  </li>`;

export default class PointListView extends AbstractView {
  get template() {
    return createPointListTemplate();
  }

  addComponent(component) {
    const li = createElement(createPointListItemTemplate());
    render(component, li);
    this.element.append(li);
  }
}
