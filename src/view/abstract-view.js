import {createElement} from '../render.js';

export default class AbstractView {
  getTemplate() {
    throw new Error();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
