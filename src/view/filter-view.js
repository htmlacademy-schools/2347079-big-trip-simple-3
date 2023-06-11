import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter) => `
    <div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}">
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
    </div>`;

const createFilterTemplate = (filterItems) => `
    <form class="trip-filters" action="#" method="get">
      ${filterItems.map((filter) => createFilterItemTemplate(filter)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;

export default class FilterFormView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
