import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export const LIST_TABLE_SIZE: number = 20;

@Component({
  selector: 'lists-pagination',
  template: require('./lists-pagination.pug'),
  styles: [ require('./lists-pagination.scss') ]
})

export class ListsPaginationComponent implements OnInit {
  @Input() tableDataSize: number;
  @Input() tabName: string;
  @Input() parentSubject: Subject<any>;
  @Input()
  set sortClicked(sortClicked: string){
    console.log(sortClicked);
    this.pageChange(0);
  }

  @Output() pageChangeClick: EventEmitter<{pageNumber: number}> = new EventEmitter<any>();

  public currentPage: number = 1;
  public firstPage: number = 1;
  public lastPage: number;
  public pageNumbers: Array<Number>;
  public totalPages: number;

  ngOnInit() {
    this.lastPage = this.totalPages = Math.ceil(this.tableDataSize / LIST_TABLE_SIZE) || 0;
    this.pageNumbers = this.getPageNumbers();
  }

  public pageChange(pageNumber: number) {
    this.pageChangeClick.emit({pageNumber: pageNumber + 1});
    this.currentPage = pageNumber + 1;
    this.pageNumbers = this.getPageNumbers();
  }

  public getPageNumbers(): Array<Number> {
    let _startIndex: number, _endIndex: number;

    if (this.lastPage < 11) {
      _startIndex = 1;
      _endIndex = this.lastPage;
    } else if (this.currentPage < 6) {
      _startIndex = 1;
      _endIndex = this.lastPage < 10 ? this.lastPage : 10;
    } else if (this.currentPage > this.lastPage - 5) {
      _startIndex = this.lastPage - 9;
      _endIndex = this.lastPage;
    } else {
      _startIndex = this.currentPage - 4;
      _endIndex = this.currentPage + 5;
    }

    return new Array(_endIndex - _startIndex + 1)
      .fill('')
      .map((val: number, idx: number) => idx + _startIndex - 1);
  }
}
