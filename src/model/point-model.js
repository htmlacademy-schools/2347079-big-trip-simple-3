import { generatePoints } from '../mock/point';

const POINT_COUNT = 1;

export default class PointsModel {
  #points = [];

  constructor() {
    this.#points.push(...generatePoints(POINT_COUNT));
  }

  get points() {
    return this.#points;
  }
}
