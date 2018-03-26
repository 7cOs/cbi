import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'list-detail',
  template: require('./list-detail.component.pug'),
  styles: [require('./list-detail.component.scss')]
})

export class ListDetailComponent implements OnInit, OnDestroy {
  public tableData = [
  {
    descriptionRow0: 'descrow0',
    descriptionRow1: 'descrow1',
    descriptionRow2: 'descrow2',
    metricColumn0: 0,
    metricColumn1: 1,
    metricColumn2: 2,
    metricColumn3: 3,
    metricColumn4: 4,
    metricColumn5: 5,
    depletionDate: '2017-08-01'
  } ];

  constructor(
    private titleService: Title,
    @Inject('$state') private $state: any,
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.$state.current.title);
  }

  ngOnDestroy() { }
}
