import {createElement, render} from '../render.js';
import AbstractView from './abstract-view.js';

const createPointListTemplate = () =>
  `<ul class="trip-events__list">
  </ul>`;

const createPointListItemTemplate = () =>
  `<li class="trip-events__item">
  </li>`;

export default class PointListView extends AbstractView {
  getTemplate() {
    return createPointListTemplate();
  }

  addComponent(component) {
    const li = createElement(createPointListItemTemplate());
    render(component, li);
    this.getElement().append(li);
  }
}
