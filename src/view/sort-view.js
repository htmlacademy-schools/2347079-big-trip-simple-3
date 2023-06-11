import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortItemTemplate = (sortName, sortStatus) => `
  <div class="trip-sort__item  trip-sort__item--${sortName}">
    <input id="sort-${sortName}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortName}" ${sortStatus}>
    <label class="trip-sort__btn" for="sort-${sortName}" data-sort-type="${sortName}">${sortName}</label>
  </div>
`;

const createSortTemplate = (currentActiveSort) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${createSortItemTemplate(SortType.DAY, currentActiveSort === SortType.DAY ? 'checked' : '')}
    ${createSortItemTemplate(SortType.EVENT, 'disabled')}
    ${createSortItemTemplate(SortType.TIME, 'disabled')}
    ${createSortItemTemplate(SortType.PRICE, currentActiveSort === SortType.PRICE ? 'checked' : '')}
    ${createSortItemTemplate(SortType.OFFERS, 'disabled')}
  </form>
`;


export default class SortView extends AbstractView {
  #currentActiveSort = SortType.DAY;

  get template() {
    return createSortTemplate(this.#currentActiveSort);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    evt.preventDefault();
    this.#currentActiveSort = evt.target.dataset.sortType;
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
