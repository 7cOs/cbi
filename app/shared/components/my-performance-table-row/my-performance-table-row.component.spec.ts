import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import * as Chance from 'chance';

import { CssClasses } from '../../../models/css-classes.model';
import { getMyPerformanceTableRowMock } from '../../../models/my-performance-table-row.model.mock';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { MyPerformanceTableRowComponent } from './my-performance-table-row.component';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';
import { NumberPipeMock } from '../../../pipes/number.pipe.mock';

const chance = new Chance();

@Component({
  selector: 'dismissible-x',
  template: ''
})
class DismissibleXComponent { }

describe('MyPerformanceTableComponent', () => {

  let fixture: ComponentFixture<MyPerformanceTableRowComponent>;
  let componentInstance: MyPerformanceTableRowComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DismissibleXComponent,
        MyPerformanceTableRowComponent,
        NumberPipeMock
      ]
    });

    fixture = TestBed.createComponent(MyPerformanceTableRowComponent);
    componentInstance = fixture.componentInstance;
  });

  describe('when getRolegroupIconClass is called', () => {

    beforeEach(() => {
      spyOn(componentInstance, 'getRolegroupIconClass').and.callThrough();
    });

    describe('when viewtype is rolegroups', () => {
      describe('when descriptionRow0 is GEOGRAPHY', () => {
        it('should return the geography-group CSS class', () => {
          let rowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
          rowData.descriptionRow0 = 'GEOGRAPHY';

          componentInstance.viewType = SalesHierarchyViewType.roleGroups;
          componentInstance.rowData = rowData;
          let iconCSS: CssClasses = componentInstance.getRolegroupIconClass();
          expect(iconCSS).toEqual({'geography-group-icon': true, 'rolegroup-icon': false, 'account-group-icon': false});
        });
      });

      describe('when descriptionRow0 is neither GEOGRAPHY nor ACCOUNTS', () => {
        it('should return the geography-group CSS class', () => {
          let rowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
          rowData.descriptionRow0 = chance.string({length: 15});

          componentInstance.viewType = SalesHierarchyViewType.roleGroups;
          componentInstance.rowData = rowData;
          let iconCSS: CssClasses = componentInstance.getRolegroupIconClass();
          expect(iconCSS).toEqual({'geography-group-icon': false, 'rolegroup-icon': true, 'account-group-icon': false});
        });
      });

      describe('when descriptionRow0 is ACCOUNTS', () => {
        it('should return the account-group CSS class', () => {
          let rowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
          rowData.descriptionRow0 = 'ACCOUNTS';

          componentInstance.viewType = SalesHierarchyViewType.roleGroups;
          componentInstance.rowData = rowData;
          let iconCSS: CssClasses = componentInstance.getRolegroupIconClass();
          expect(iconCSS).toEqual({'geography-group-icon': false, 'rolegroup-icon': false, 'account-group-icon': true});
        });
      });
    });
  });

  describe('when getSublineClass is called', () => {

    beforeEach(() => {
      spyOn(componentInstance, 'getSublineClass').and.callThrough();
    });

    describe('when viewtype is subAccounts', () => {
      it('should return the link and forward arrow CSS class', () => {
        componentInstance.viewType = SalesHierarchyViewType.subAccounts;
        let dashboardLinkCss: CssClasses = componentInstance.getSublineClass();
        expect(dashboardLinkCss).toEqual({'link': true, 'forward-arrow': true});
      });
    });

    describe('when viewtype is distributors', () => {
      it('should return the link and forward arrow CSS class', () => {
        componentInstance.viewType = SalesHierarchyViewType.distributors;
        let dashboardLinkCss: CssClasses = componentInstance.getSublineClass();
        expect(dashboardLinkCss).toEqual({'link': true, 'forward-arrow': true});
      });
    });

    describe('when viewtype is accounts', () => {
      it('should not return the link and forward arrow CSS class', () => {
        componentInstance.viewType = SalesHierarchyViewType.accounts;
        let dashboardLinkCss: CssClasses = componentInstance.getSublineClass();
        expect(dashboardLinkCss).toEqual({'link': false, 'forward-arrow': false});
      });
    });
  });

  describe('getTrendClass', () => {
    it('should return positive if given a positive number', () => {
      const cls = componentInstance.getTrendClass(chance.floating({min: 1.0}));
      expect(cls).toEqual('positive');
    });

    it('should return positive if given 0', () => {
      const cls = componentInstance.getTrendClass(0);
      expect(cls).toEqual('positive');
    });

    it('should return negative if given a negative number', () => {
      const cls = componentInstance.getTrendClass(chance.floating({max: -0.1}));
      expect(cls).toEqual('negative');
    });
  });

  describe('when subline is clicked', () => {
    it('should stop event propogation when subline is clicked', () => {
      const event = jasmine.createSpyObj('event', [ 'stopPropagation' ]);
      componentInstance.sublineClicked(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('onOpportunityCountClicked', () => {
    it('should stop event propagation when an opportunity count is clicked when it is not on brands level', () => {
      const opportunityCountClickedEventSpy = jasmine.createSpyObj('event', [ 'stopPropagation' ]);
      componentInstance.opportunityCountClicked(opportunityCountClickedEventSpy, componentInstance.opportunityCountText);
      componentInstance.opportunityCountText = '123';
      componentInstance.isBrands = false;
      expect(opportunityCountClickedEventSpy.stopPropagation).toHaveBeenCalled();
    });

    it('should stop event propagation when an opportunity count is clicked when opportunity count is "0"', () => {
      const opportunityCountClickedEventSpy = jasmine.createSpyObj('event', [ 'stopPropagation' ]);
      componentInstance.opportunityCountClicked(opportunityCountClickedEventSpy, '123');
      componentInstance.opportunityCountText = '0';
      expect(opportunityCountClickedEventSpy.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('showEmptyLastColumn Input', () => {
    beforeEach(() => {
      componentInstance.rowData = getMyPerformanceTableRowMock(1)[0];
    });

    it('should contain a .right-col td element with no content when showEmptyLastColumn is true', () => {
      componentInstance.showEmptyLastColumn = true;
      fixture.detectChanges();

      const rightColumnElement = fixture.debugElement.query(By.css('.right-col'));

      expect(rightColumnElement).not.toBe(null);
      expect(rightColumnElement.nativeElement.textContent).toBe('');
    });

    it('should not contain a .right-col td element when showEmptyLastColumn is false', () => {
      componentInstance.showEmptyLastColumn = false;
      fixture.detectChanges();

      const rightColumnElement = fixture.debugElement.query(By.css('.right-col'));

      expect(rightColumnElement).toBe(null);
    });
  });

  describe('when getOpportunityCountText is called', () => {
    beforeEach(() => {
      componentInstance.rowData = getMyPerformanceTableRowMock(1)[0];
    });

    it('should return "-" when opportunitiesError is true', () => {
      componentInstance.opportunitiesError = true;
      expect(componentInstance.opportunityCountText).toEqual('-');
    });

    it('should return "0" when opportunitiesError is false, but opportunityCount is null', () => {
      componentInstance.opportunitiesError = false;
      expect(componentInstance.opportunityCountText).toEqual('0');
    });

    it('should return correct opportunity count when opportunitiesError is false and count has value', () => {
      componentInstance.rowData.opportunities = 10;
      componentInstance.opportunitiesError = false;
      expect(componentInstance.opportunityCountText).toEqual('10');
    });
  });
});
