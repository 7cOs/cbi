import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export const LIST_TABLE_SIZE: number = 20;

@Component({
  selector: 'lists-pagination',
  template: require('./lists-pagination.pug'),
  styles: [ require('./lists-pagination.scss') ]
})
export class ListsPaginationComponent implements OnInit {
  @Input() tableDataSize: number;
  @Input() tabName: string;
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
    let _start: number, _end: number;

    if (this.lastPage < 11) {
      _start = 1;
      _end = this.lastPage;
    } else if (this.currentPage < 6) {
      _start = 1;
      _end = this.lastPage < 10 ? this.lastPage : 10;
    } else if (this.currentPage > this.lastPage - 5) {
      _start = this.lastPage - 9;
      _end = this.lastPage;
    } else {
      _start = this.currentPage - 4;
      _end = this.currentPage + 5;
    }

    let pageNumbersArray: any = [];
    pageNumbersArray.length = _end - _start + 1;
    return pageNumbersArray.fill()
      .map((val: number, idx: number) => idx + _start - 1 );
  }
}
