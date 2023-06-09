import {createElement, render} from '../render.js';
import AbstractView from './abstract-view.js';

const createEventListTemplate = () =>
  `<ul class="trip-events__list">
  </ul>`;

const createEventListItemTemplate = () =>
  `<li class="trip-events__item">
  </li>`;

export default class EventListView extends AbstractView {
  getTemplate() {
    return createEventListTemplate();
  }

  addComponent(component) {
    const li = createElement(createEventListItemTemplate());
    this.getElement().append(li);
    render(component, li);
  }
}
