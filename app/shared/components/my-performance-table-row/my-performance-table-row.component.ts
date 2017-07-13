import { Component, Input } from '@angular/core';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';

@Component({
  selector: '[my-performance-table-row]',
  template: require('./my-performance-table-row.component.pug'),
  styles: [ require('../my-performance-table/my-performance-table.component.scss')]
})
export class MyPerformanceTableRowComponent {
  @Input() rowData: MyPerformanceTableRow;
  @Input() showOpportunities: boolean;

  constructor() { }

  ngOnInit() {
    console.log(this.rowData, this.showOpportunities);
  }
}
