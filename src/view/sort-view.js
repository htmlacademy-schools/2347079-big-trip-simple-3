import AbstractView from '../framework/view/abstract-view.js';

const createSortItemTemplate = (sort) => `
  <div class="trip-sort__item  trip-sort__item--${sort.name}">
    <input id="sort-${sort.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort.name}">
    <label class="trip-sort__btn" for="sort-${sort.name}">${sort.name}</label>
  </div>
`; // disabled

const createSortTemplate = (sortItems) =>
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItems.map((sortItem) => createSortItemTemplate(sortItem)).join('')}
  </form>`;

export default class SortView extends AbstractView {
  #sorts = null;

  constructor(sorts) {
    super();
    this.#sorts = sorts;
  }

  get template() {
    return createSortTemplate(this.#sorts);
  }
}
