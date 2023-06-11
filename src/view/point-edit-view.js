import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES } from '../const.js';
import { destinationsStorage, getDefaultPoint, offersStorage } from '../mock/point.js';
import { compareDates, getFormattedDate, getIdFromTag, turnModelDateToFramework, validateNumber } from '../utils/util.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createPointIconTemplate = (id, type) => (`
    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">`
);

const mapPointTypes = (id) => POINT_TYPES.map((pointType) => `
  <div class="event__type-item">
    <input id="event-type-taxi-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}">
    <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${id}">${pointType.charAt(0).toUpperCase()}${pointType.slice(1)}</label>
  </div>`).join('');

const createPointTypeListTemplate = (id) => (`
  <div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>
    ${mapPointTypes(id)}
  </fieldset>
  </div>
`);

const createDestinationListTemplate = () => destinationsStorage.map((destination) => (`<option value="${destination.name}"></option>`)).join('');

const createPointDestinationTemplate = (id, type, destination) => (`
  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-${id}">
      ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
    <datalist id="destination-list-${id}">
      ${createDestinationListTemplate()}
    </datalist>
  </div>
`);

const createPointTimeTemplate = (id, dateFrom, dateTo) => (`
  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-${id}}">From</label>
    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${getFormattedDate(dateFrom, 'DD/MM/YY HH:mm')}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-${id}">To</label>
    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${getFormattedDate(dateTo, 'DD/MM/YY HH:mm')}">
  </div>
`);

const createPointPriceTemplate = (id, price) => (`
  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${id}">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${validateNumber(price)}">
  </div>
`);

const mapOffers = (stateOffers) => {
  const markup = [];
  for (const offer of stateOffers) {
    markup.push(`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${offer.isChecked ? 'checked' : ''}>
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

const createPointOffersTemplate = (stateOffers) => (`
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${mapOffers(stateOffers)}
    </div>
  </section>
`);

const getDestinationPicturesMarkup = (destination) => destination.pictures.map((pic) => `
  <img class="event__photo" src="${pic.src}.jpg" alt="${pic.description}">
`);

const createPointDestDetailsTemplate = (destination) => (`
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${getDestinationPicturesMarkup(destination)}
      </div>
    </div>
  </section>
`);

const createPointEditTemplate = (data) => {
  const dataDestination = destinationsStorage[data.destination];
  const pointIconTemplate = createPointIconTemplate(data.id, data.type);
  const pointTypeListTemplate = createPointTypeListTemplate(data.id);
  const pointDestinationTemplate = createPointDestinationTemplate(data.id, data.type, dataDestination);
  const pointTimeTemplate = createPointTimeTemplate(data.id, data.date_from, data.date_to);
  const pointPriceTemplate = createPointPriceTemplate(data.id, data.base_price);
  const pointOffersTemplate = createPointOffersTemplate(data.state_offers);
  const pointDestDetailsTemplate = createPointDestDetailsTemplate(dataDestination);

  return `
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      ${pointIconTemplate}
      ${pointTypeListTemplate}
    </div>

    ${pointDestinationTemplate}
    ${pointTimeTemplate}
    ${pointPriceTemplate}

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    ${pointOffersTemplate}
    ${pointDestDetailsTemplate}
  </section>
  </form>`;
};

export default class PointEditView extends AbstractStatefulView {
  #datepickers = [];
  _state = null;

  constructor(point = getDefaultPoint()) {
    super();
    this._state = PointEditView.parsePointToState(point);

    this.#setInnerHandlers();
    this.#setDatepickers();
  }

  get template() {
    return createPointEditTemplate(this._state);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickers) {
      this.#datepickers.forEach((dp) => dp.destroy());
      this.#datepickers = [];
    }
  };

  reset = (point) => {
    this.updateElement(PointEditView.parsePointToState(point));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #setInnerHandlers = () => {
    for (const offer of this._state.state_offers) {
      this.element.querySelector(`#event-offer-${offer.id}`)
        .addEventListener('click', this.#offersHandler);
    }
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceHandler);
    this.element.querySelectorAll('.event__type-item')
      .forEach(
        (item) => item.addEventListener('click', this.#typeHandler)
      );
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationHandler);
  };

  #dateFromChangeHandler = ([ndate]) =>{
    this.updateElement({
      'date_from': ndate,
    });
  };

  #dateToChangeHandler = ([ndate]) =>{
    this.updateElement({
      'date_to': ndate,
    });
  };

  #isBeforeDateFrom = (date) => compareDates(date, this._state.date_from);

  #setDatepickers = () => {
    this.#datepickers = [
      flatpickr(
        this.element.querySelectorAll('.event__input--time')[0],
        {
          enableTime: true,
          'time_24hr': true,
          dateFormat: 'd/m/y H:i',
          defaultDate: turnModelDateToFramework(this._state.date_from),
          onChange: this.#dateFromChangeHandler,
        },
      ),
      flatpickr(
        this.element.querySelectorAll('.event__input--time')[1],
        {
          enableTime: true,
          'time_24hr': true,
          dateFormat: 'd/m/y H:i',
          defaultDate: turnModelDateToFramework(this._state.date_to),
          onChange: this.#dateToChangeHandler,
          'disable': [this.#isBeforeDateFrom],
        },
      )];
  };

  #offersHandler = (evt) => {
    evt.preventDefault();
    const clickedOfferId = getIdFromTag(evt.target);
    const stateOffers = this._state.state_offers;
    for (const offer of stateOffers) {
      if (offer.id === clickedOfferId) {
        offer.isChecked = !offer.isChecked;
        break;
      }
    }
    this.updateElement({
      'state_offers': stateOffers,
    });
  };

  #priceHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      'base_price': evt.target.value,
    });
  };

  #typeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      'type': evt.target.textContent.toLowerCase(),
    });
  };

  static getDestinationId = (destinationName) => destinationsStorage.map((current) => current.name).indexOf(destinationName);

  #destinationHandler = (evt) => {
    evt.preventDefault();
    const destination = evt.target.value;
    const index = PointEditView.getDestinationId(destination);
    if (index !== -1) {
      this.updateElement({
        'destination': index,
      });
    }
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn')
      .addEventListener('click', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointEditView.parseStateToPoint(this._state));
  };

  setFormResetHandler = (callback) => {
    this._callback.formReset = callback;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formResetHandler);
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formReset();
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => {
    const offs = [];
    for (const off of Object.values(offersStorage)) {
      offs.push({...off, 'isChecked': point.offers.includes(off.id)});
    }
    return {...point, 'state_offers': offs};
  };

  static parseStateToPoint = (state) => {
    // state_offer: {id, title, price, isChecked}
    // state_offers = [{}, {}, ...]
    const point = {...state};
    const noffers = [];
    point.state_offers.map((stoff) => {
      if (stoff.isChecked) {
        noffers.push(stoff.id);
      }
    });
    point.offers = noffers;
    delete point.state_offers;
    return point;
  };
}
