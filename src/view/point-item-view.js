import AbstractView from '../framework/view/abstract-view.js';
import { getFormattedDate, validateNumber } from '../utils/util.js';
import PointsModel from '../model/point-model.js';

const createPointTemplate = (point, availableOffers, availableDestinations) => {
  const pointIcon = `img/icons/${point.type}.png`;
  const getOffersMarkup = () => {
    if (point.offers.length === 0) {
      return `
      <li class="event__offer">
      <span class="event__offer-title">No additional offers</span>
      </li>
      `;
    } else {
      const markup = [];
      for (const offer of availableOffers) {
        markup.push(`
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `);
      }
      return markup.join('\n');
    }
  };

  return `<div class="event">
    <time class="event__date" datetime="${getFormattedDate(point.date_from, 'YYYY-MM-DD')}">${getFormattedDate(point.date_from, 'MMM D')}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="${pointIcon}" alt="Event type icon">
    </div>
    <h3 class="event__title">${point.type} ${availableDestinations[point.destination - 1].name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${getFormattedDate(point.date_from)}">${getFormattedDate(point.date_from, 'HH:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="${getFormattedDate(point.date_to)}">${getFormattedDate(point.date_to, 'HH:mm')}</time>
      </p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${validateNumber(point.base_price)}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${getOffersMarkup()}
    </ul>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>`;
};

export default class PointItemView extends AbstractView {
  #element = null;
  #availableOffers = [];
  #availableDestinations = [];

  constructor(point = PointsModel.defaultPoint(), availableOffers = [], availableDestinations = []) {
    super();
    this.#element = point;
    this.#availableOffers = availableOffers;
    this.#availableDestinations = availableDestinations;
  }

  get template() {
    return createPointTemplate(this.#element, this.#availableOffers, this.#availableDestinations);
  }

  setEditButtonClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
