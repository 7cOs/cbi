import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { ListsSummary } from '../../../models/lists/lists-header.model';

@Component({
  selector: 'lists-header',
  template: require('./lists-header.pug'),
  styles: [ require('./lists-header.scss') ]
})
export class ListsHeaderComponent implements OnChanges {
  @Output() listsLinkClicked = new EventEmitter<any>();
  @Output() manageButtonClicked = new EventEmitter<any>();
  @Input() set summaryData(summaryData: ListsSummary) {
    if (summaryData) {
      this.headerData = summaryData;
    }
  }

  public headerData: ListsSummary;
  ngOnChanges() {
    console.log(this.summaryData);
  }
}
