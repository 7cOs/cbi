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
  public tableData = getListPerformanceTableRowMock(1000);
  public tableHeader = getListPerformanceHeaderRowMock();
  public totalRow = {
    storeColumn: 'Total',
    distributorColumn: '',
    segmentColumn: '',
    cytdColumn: 0,
    cytdVersusYaColumn: 1,
    cytdVersusYaPercentColumn: 2,
    l90Column: 3,
    l90VersusYaColumn: 4,
    l90VersusYaPercentColumn: 5,
    lastDepletionDate: '',
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
