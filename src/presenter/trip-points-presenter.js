import {render} from '../render.js';
import PointListView from '../view/point-list-view.js';
import PointListSortView from '../view/point-list-sort-view.js';
import PointItemView from '../view/point-item-view.js';
import PointListEditFormView from '../view/point-list-form-view.js';

export default class TripPointsPresenter {
  pointListComponent = new PointListView();

  init(container, pointsModel) {
    this.container = container;
    this.pointsModel = pointsModel;
    this.pointList = [...this.pointsModel.getPoints()];
    render(new PointListSortView(), this.container);
    render(this.pointListComponent, this.container);
    this.pointListComponent.addComponent(new PointListEditFormView(this.pointList[0]));
    for (let i = 1; i < this.pointList.length; i++) {
      this.pointListComponent.addComponent(new PointItemView(this.pointList[i]));
    }
  }
}
