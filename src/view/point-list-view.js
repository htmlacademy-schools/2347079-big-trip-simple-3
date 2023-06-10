import {createElement, render} from '../render.js';
import AbstractView from './abstract-view.js';

const createPointListTemplate = () =>
  `<ul class="trip-events__list">
  </ul>`;

const createPointListItemTemplate = () =>
  `<li class="trip-events__item">
  </li>`;

export default class PointListView extends AbstractView {
  #isEmpty = true;

  get template() {
    return createPointListTemplate();
  }

  addComponent(component) {
    const li = createElement(createPointListItemTemplate());
    render(component, li);
    this.element.append(li);
    this.#isEmpty = false;
  }

  replaceComponent(component1, component2) {
    this.element.replaceChild(component1.element, component2.element);
  }
}
