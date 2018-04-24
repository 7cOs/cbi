import { Component, Input, EventEmitter, Output, Inject, OnInit, OnChanges } from '@angular/core';
import { ListsSummary } from '../../../models/lists/lists-header.model';

@Component({
  selector: 'lists-header',
  template: require('./lists-header.pug'),
  styles: [ require('./lists-header.scss') ]
})
export class ListsHeaderComponent implements OnInit, OnChanges {
  @Output() listsLinkClicked = new EventEmitter<any>();
  @Output() manageButtonClicked = new EventEmitter<any>();
  @Input() set summaryData(summaryData: ListsSummary) {
    this.headerData = summaryData;
  }

  public headerData: ListsSummary = <ListsSummary>{};
  public currentUser: boolean;
  public ownerName: string;
  private firstName: string;
  private lastName: string;
  private currentUserFullName: string;

  constructor(
    @Inject('userService') private userService: any
  ) { }

  ngOnInit() {
    this.firstName = this.userService.model.currentUser.firstName;
    this.lastName = this.userService.model.currentUser.lastName;
  }

  ngOnChanges() {
    this.getOwnerName(this.firstName, this.lastName );
  }

  private getOwnerName(first: string , last: string) {
    this.currentUserFullName = `${first} ${last}`;
    if (this.headerData.ownerFirstName && this.headerData.ownerLastName) {
      this.ownerName = `${this.headerData.ownerFirstName} ${this.headerData.ownerLastName}`;
    }
    if (this.currentUserFullName === this.ownerName) {
      this.currentUser = (this.currentUserFullName === this.ownerName);
    }
  }
}
