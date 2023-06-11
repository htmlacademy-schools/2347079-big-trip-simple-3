import AbstractView from '../framework/view/abstract-view.js';
import { POINT_TYPES } from '../const.js';
import { destinationsStorage, offersStorage } from '../mock/point.js';

const pointPriceMarkup = (point) => point.base_price ? point.base_price : '';

const createPointListFormTemplate = (point) => {
  const pointDestination = destinationsStorage[point.destination];
  const pointTypeIconMarkup = `img/icons/${point.type}.png`;
  const getPointTypesMarkup = () => POINT_TYPES.map((pointType) => `
    <div class="event__type-item">
      <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}">
      <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${pointType.charAt(0).toUpperCase()}${pointType.slice(1)}</label>
    </div>`).join('');

  const getDestinationsMarkup = () => {
    const markup = [];
    for (const destination of Object.values(destinationsStorage)) {
      markup.push(`
      <option value="${destination.name}"></option>
      `);
    }
    return markup.join('');
  };

  const getOffersMarkup = () => {
    const markup = [];
    for (const offer of Object.values(offersStorage)) {
      markup.push(`
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${point.offers.includes(offer.id) ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
    `);
    }
    return markup.join('');
  };

  const getDestinationPicturesMarkup = () => pointDestination.pictures.map((pic) => `
    <img class="event__photo" src="${pic.src}.jpg" alt="${pic.description}">
  `);

  const getDateMarkup = (date) => date ? date.format('DD/MM/YY HH:mm') : '';

  return `
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="${pointTypeIconMarkup}" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
            ${getPointTypesMarkup()}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${point.type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${getDestinationsMarkup()}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateMarkup(point.date_from)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateMarkup(point.date_to)}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${pointPriceMarkup(point)}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${getOffersMarkup()}
      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${pointDestination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${getDestinationPicturesMarkup()}
        </div>
      </div>
    </section>
  </section>
  </form>`;
};

export default class PointListFormView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createPointListFormTemplate(this.#point);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);
    // this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(this.#point);
  };

  setFormResetHandler = (callback) => {
    this._callback.formReset = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formResetHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formResetHandler);
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formReset();
  };
}
