import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
// TODO: Remove this when we get real data.
import { getListPerformanceTableRowMock,
  getListPerformanceHeaderRowMock } from '../../models/list-performance/list-performance-table-row.model.mock';

@Component({
  selector: 'list-detail',
  template: require('./list-detail.component.pug'),
  styles: [require('./list-detail.component.scss')]
})

export class ListDetailComponent implements OnInit, OnDestroy {

  // TODO: Remove this when we get real data.
  public tableData = getListPerformanceTableRowMock(100);
  public tableHeader = getListPerformanceHeaderRowMock();
  public totalRow = {
    descriptionRow0: 'Total',
    descriptionRow1: '',
    descriptionRow2: '',
    metricColumn0: 0,
    metricColumn1: 1,
    metricColumn2: 2,
    metricColumn3: 3,
    metricColumn4: 4,
    metricColumn5: 5,
    depletionDate: '',
    performanceError: false
  };

  constructor(
    private titleService: Title,
    @Inject('$state') private $state: any,
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.$state.current.title);
  }

  ngOnDestroy() { }
}
