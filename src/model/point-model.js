import { generatePoints, getDefaultPoint } from '../mock/point';

const POINT_COUNT = 3;

export default class PointsModel {
  constructor() {
    this.points = [];
    this.points.push(getDefaultPoint());
    this.points.push(...generatePoints(POINT_COUNT));
  }

  getPoints = () => this.points;
}
