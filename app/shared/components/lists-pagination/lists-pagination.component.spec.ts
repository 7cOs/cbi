import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ListsPaginationComponent } from './lists-pagination.component';
import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'lists-pagination',
  template: ''
})

class ListsPaginationComponentMock {
  @Input() sortClick: Event;
}

xdescribe('ListsPaginationComponent', () => {
  let fixture: ComponentFixture<ListsPaginationComponent>;
  let componentInstance: ListsPaginationComponent;
  let componentInstanceCopy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListsPaginationComponent,
        ListsPaginationComponentMock,
      ],
      providers: []
    });

    fixture = TestBed.createComponent(ListsPaginationComponent);
    const sortSubject: Subject<Event> = new Subject<Event>();
    componentInstance.sortClick = sortSubject;
    componentInstance = fixture.componentInstance;
    componentInstanceCopy = componentInstance as any;
  });

  xdescribe('ngOnInit', () => {

    beforeEach(() => {
      componentInstance.tableDataSize = 200;
    });

    it('should set last page and get pageNumbers', () => {
      spyOn(componentInstance, 'getPageNumbers');
      componentInstance.ngOnInit();
      fixture.detectChanges();
      expect(componentInstance.totalPages).toBe(10);
      expect(componentInstance.lastPage).toBe(10);
      expect(componentInstance.getPageNumbers).toHaveBeenCalled();
    });

    it('should check if subscribe is called', (done: any) => {
      spyOn(componentInstance, 'pageChange');
      componentInstance.ngOnInit();
      spyOn(componentInstance.sortClick, 'subscribe');
      fixture.detectChanges();
      expect(componentInstance.sortClick.subscribe).toHaveBeenCalled();
      componentInstance.sortClick.subscribe(() => {
        expect(componentInstance.pageChange).toHaveBeenCalledWith(0);
        done();
      });
    });
  });

  describe('when page is changed', () => {
    it('should emit an event and set the current page', fakeAsync(() => {
      const expectedPageNumbers = [0, 1, 2, 3, 4, 5, 6];
      spyOn(componentInstance.pageChangeClick, 'emit');
      spyOn(componentInstance, 'getPageNumbers').and.returnValue(expectedPageNumbers);
      componentInstance.pageChange(5);
      tick(1);
      expect(componentInstance.pageChangeClick.emit).toHaveBeenCalledWith({pageNumber: 6});
      expect(componentInstance.currentPage).toBe(6);
      expect(componentInstance.getPageNumbers).toHaveBeenCalled();
      expect(componentInstance.pageNumbers).toBe(expectedPageNumbers);
    }));
  });

  describe('when getPageNumbers is called', function() {
    beforeEach(function() {
      componentInstance.currentPage = 1;
      componentInstance.lastPage = 1;
    });

    it('should result in pageNumbers being set to an array of 7 items', () => {
      componentInstance.currentPage = 1;
      componentInstance.lastPage = 7;
      const actualResult = componentInstance.getPageNumbers();
      fixture.detectChanges();
      expect(actualResult).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });

    it('should result in pageNumbers being set to an array of 7 items even if current page is 6', function() {
      componentInstance.currentPage = 6;
      componentInstance.lastPage = 7;
      const actualResult = componentInstance.getPageNumbers();
      fixture.detectChanges();
      expect(actualResult).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });

    it('should result in pageNumbers being set to an array of 7 items even if current page is 7', function() {
      componentInstance.currentPage = 7;
      componentInstance.lastPage = 7;
      const actualResult = componentInstance.getPageNumbers();
      fixture.detectChanges();
      expect(actualResult).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });

    it('should result in pageNumbers being set to an array of 10 items', function() {
      componentInstance.currentPage = 1;
      componentInstance.lastPage = 15;
      const actualResult = componentInstance.getPageNumbers();
      fixture.detectChanges();
      expect(actualResult).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should result in pageNumbers being set to an array of 10 items, but start at 2 when current page is 7', function() {
      componentInstance.currentPage = 7;
      componentInstance.lastPage = 15;
      const actualResult = componentInstance.getPageNumbers();
      fixture.detectChanges();
      expect(actualResult).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });

    it('results in pageNumbers being set to an array of 10 items, but start at 4 when current page is 8', function() {
      componentInstance.currentPage = 8;
      componentInstance.lastPage = 15;
      const actualResult = componentInstance.getPageNumbers();
      fixture.detectChanges();
      expect(actualResult).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });

    it('results in pageNumbers being set to an array of 10 items, but start at 6 when current page is 10', function() {
      componentInstance.currentPage = 10;
      componentInstance.lastPage = 15;
      const actualResult = componentInstance.getPageNumbers();
      fixture.detectChanges();
      expect(actualResult).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    });

   it('results in pageNumbers being set to an array of 10 items, but start at 6 when current page is 15', function() {
      componentInstance.currentPage = 15;
      componentInstance.lastPage = 15;
      const actualResult = componentInstance.getPageNumbers();
      fixture.detectChanges();
      expect(actualResult).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    });
  });
});
