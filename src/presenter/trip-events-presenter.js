import {render} from '../render.js';
import EventListView from '../view/event-list-view.js';
import EventListSortView from '../view/event-list-sort-view.js';
import EventItemView from '../view/event-item-view.js';
import EventListEditFormView from '../view/event-list-edit-view.js';

export default class TripEventsPresenter {
  eventListComponent = new EventListView();

  init(container) {
    this.container = container;

    render(new EventListSortView(), this.container);
    render(this.eventListComponent, this.container);
    this.eventListComponent.addComponent(new EventListEditFormView());

    for (let i = 0; i < 3; i++) {
      this.eventListComponent.addComponent(new EventItemView());
    }
  }
}
