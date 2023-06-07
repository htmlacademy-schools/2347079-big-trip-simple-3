import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;

  #points = [];
  #offers = [];
  #destinations = [];

  constructor (pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      this.#points = await this.#pointsApiService.points;
    } catch(err) {
      this.#points = [];
    }

    try {
      this.#offers = await this.#pointsApiService.offers;
    } catch(err) {
      this.#offers = [];
    }

    try {
      this.#destinations = await this.#pointsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Cant update unexisting point');
    }

    try {
      const updatedPoint = await this.#pointsApiService.updatePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Cant update point');
    }
  };

  addPoint = async (updateType, update) => {
    try {
      const newPoint = await this.#pointsApiService.addPoint(update);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Cant add point');
    }
  };

  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Cant delete unexisting points');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Cant delete point');
    }
  };
}
