import { ComponentFixture, fakeAsync, TestBed,  tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ListsHeaderComponent } from './lists-header.component';
import { Component, Input } from '@angular/core';

class BeerLoaderComponentMock {
  @Input() showLoader: false;
}

@Component({
  selector: '[lists-header]',
  template: ''
})

class MockMyPerformanceTableRowComponent {
  @Input() rowData: MyPerformanceTableRow;
}

describe('ListsHeaderComponent', () => {
  let fixture: ComponentFixture<ListsHeaderComponent>;
  let componentInstance: ListsHeaderComponent;
  let tableHeaderRow: Array<string> = ['column1', 'column2', 'column3'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListsHeaderComponent
      ]
    });

    fixture = TestBed.createComponent(ListsHeaderComponent);
    componentInstance = fixture.componentInstance;
    componentInstance.tableHeaderRow = tableHeaderRow;

  });

  describe('when calling onRowClicked', () => {

    it('Should call onButtonClicked when element is clicked', fakeAsync(() => {
      spyOn(componentInstance, 'onButtonClicked').and.callThrough();
      const element = fixture.debugElement.query(By.css('.btn-action')).nativeElement;
      element.click();
      expect(componentInstance.onButtonClicked).toHaveBeenCalled();
    }));

    it('should emit an event when the viewtype is accounts', () => {
      componentInstance.actionLabel = 'Add To List';
      spyOn(componentInstance.onActionButtonClicked, 'emit');
      componentInstance.onButtonClicked();
      componentInstance.onButtonClicked();
      expect(componentInstance.onActionButtonClicked.emit).toHaveBeenCalled();
      expect(componentInstance.onActionButtonClicked.emit).toHaveBeenCalledWith({actionType: 'Add To List'});
    });

  });
});
