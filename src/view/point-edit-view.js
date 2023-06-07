import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES, defaultPoint } from '../const.js';
import { compareDates,
  getFormattedDate,
  getIdFromTag,
  turnModelDateToFramework,
  validateNumber,
  getListElementId,
  getListElementsNamesList,
  getAvailableOffers
} from '../utils/util.js';

const createPointIconTemplate = (id, type, isDisabled) => (`
    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>`
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

const createDestinationListTemplate = (availableDestinations) =>
  availableDestinations
    .map((destination) => (`<option value="${destination.name}"></option>`))
    .join('');

const createPointDestinationTemplate = (id, type, destination, availableDestinations, isDisabled) => (`
  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-${id}">
      ${type}
    </label>
    <input
    class="event__input  event__input--destination"
    id="event-destination-${id}"
    type="text"
    name="event-destination"
    value="${destination.name}"
    list="destination-list-${id}"
    ${isDisabled ? 'disabled' : ''}>
    <datalist id="destination-list-${id}">
      ${createDestinationListTemplate(availableDestinations)}
    </datalist>
  </div>
`);

const createPointTimeTemplate = (id, dateFrom, dateTo, isDisabled) => (`
  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-${id}}">From</label>

    <input
    class="event__input  event__input--time"
    id="event-start-time-${id}"
    type="text"
    name="event-start-time"
    value="${getFormattedDate(dateFrom, 'DD/MM/YY HH:mm')}"
    ${isDisabled ? 'disabled' : ''}>

    &mdash;

    <label class="visually-hidden" for="event-end-time-${id}">To</label>

    <input
    class="event__input  event__input--time"
    id="event-end-time-${id}"
    type="text"
    name="event-end-time"
    value="${getFormattedDate(dateTo, 'DD/MM/YY HH:mm')}"
    ${isDisabled ? 'disabled' : ''}>

  </div>
`);

const createPointPriceTemplate = (id, price, isDisabled) => (`
  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${id}">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>

    <input
    class="event__input  event__input--price"
    id="event-price-${id}"
    type="text"
    name="event-price"
    value="${validateNumber(price)}"
    ${isDisabled ? 'disabled' : ''}>
  </div>
`);

const mapOffers = (stateOffers, isDisabled) => {
  const markup = [];
  for (const offer of stateOffers) {
    markup.push(`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
        id="event-offer-${offer.id}"
        type="checkbox"
        name="event-offer-${offer.id}"
        ${offer.isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}>
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

const createPointOffersTemplate = (stateOffers, isDisabled) => {
  if (stateOffers.length === 0) {
    return '';
  }
  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${mapOffers(stateOffers, isDisabled)}
      </div>
    </section>`;
};

const getDestinationPicturesMarkup = (destination) => destination.pictures.map((pic) => `
  <img class="event__photo" src="${pic.src}" alt="${pic.description}">
`).join('');

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

const createPointEditTemplate = (data, availableDestinations) => {
  const {isDisabled, isSaving, isDeleting} = data;
  const dataDestination = availableDestinations[data.destination - 1];
  const pointIconTemplate = createPointIconTemplate(data.id, data.type, isDisabled);
  const pointTypeListTemplate = createPointTypeListTemplate(data.id);
  const pointDestinationTemplate = createPointDestinationTemplate(data.id, data.type, dataDestination, availableDestinations, isDisabled);
  const pointTimeTemplate = createPointTimeTemplate(data.id, data.date_from, data.date_to, isDisabled);
  const pointPriceTemplate = createPointPriceTemplate(data.id, data.base_price, isDisabled);
  const pointOffersTemplate = createPointOffersTemplate(data.state_offers, isDisabled);
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

    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
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
  _state = null;

  #datepickers = [];
  #availableOffers = [];
  #availableDestinations = [];

  constructor(point = defaultPoint(), availableOffers = [], availableDestinations = []) {
    super();
    this._state = PointEditView.parsePointToState(point, getAvailableOffers(point.type, availableOffers));
    this.#availableOffers = availableOffers;
    this.#availableDestinations = availableDestinations;

    this.#setInnerHandlers();
    this.#setDatepickers();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#availableDestinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickers) {
      this.#datepickers.forEach((dp) => dp.destroy());
      this.#datepickers = [];
    }
  };

  reset = (point, availableOffers) => {
    this.updateElement(PointEditView.parsePointToState(point, getAvailableOffers(point.type, availableOffers)));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormResetHandler(this._callback.formReset);
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

  #typeHandler = (evt) => {
    evt.preventDefault();
    const ntype = evt.target.textContent.toLowerCase();
    this.updateElement({
      'type': ntype,
      'state_offers': getAvailableOffers(ntype, this.#availableOffers),
    });
  };

  #destinationHandler = (evt) => {
    evt.preventDefault();
    const destination = evt.target.value;
    if (getListElementsNamesList(this.#availableDestinations).includes(destination)) {
      const index = getListElementId(destination, this.#availableDestinations);
      this.updateElement({
        'destination': index,
      });
    }
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

  #priceHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      'base_price': evt.target.value,
    });
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

  static parsePointToState = (point, availableOffers) => {
    const offs = [];
    for (const off of availableOffers) {
      offs.push({...off, 'isChecked': point.offers.includes(off.id)});
    }
    return {
      ...point,
      'state_offers': offs,
      'isDisabled': false,
      'isSaving': false,
      'isDeleting': false,
    };
  };

  static parseStateToPoint = (state) => {
    const point = {...state};
    const noffers = point.state_offers.filter((stoff) => stoff.isChecked);
    point.offers = noffers;
    delete point.state_offers;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  };
}
