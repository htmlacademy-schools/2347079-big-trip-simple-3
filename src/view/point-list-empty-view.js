import AbstractView from './abstract-view.js';

const tempMsgConst = 'Click New Event to create your first point';

const createEmptyListMessageTemplate = (msg) =>
  `<p class="trip-events__msg">${msg}</p>`;

export default class EmptyPointListView extends AbstractView {
  get template() {
    return createEmptyListMessageTemplate(tempMsgConst);
  }
}
