import { Component, Input, EventEmitter, OnChanges, Output, SimpleChanges, OnInit } from '@angular/core';

@Component({
  selector: 'lists-header',
  template: require('./lists-header.pug'),
  styles: [ require('./lists-header.scss') ]
})
export class ListsHeaderComponent {
  @Output() listsLinkClicked = new EventEmitter<any>();
  @Output() manageButtonClicked = new EventEmitter<any>();
  @Input() summaryData: ListsSummary;
}
