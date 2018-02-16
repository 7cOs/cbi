import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import * as Chance from 'chance';

import { CssClasses } from '../../../models/css-classes.model';
import { getMyPerformanceTableRowMock } from '../../../models/my-performance-table-row.model.mock';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { MyPerformanceTableRowComponent } from './my-performance-table-row.component';
import { ProductMetricsViewType } from '../../../enums/product-metrics-view-type.enum';
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
        fit('should return the geography-group CSS class', () => {
          let tableRowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
          tableRowData.descriptionRow0 = 'GEOGRAPHY';
          tableRowData.opportunities = undefined;

          componentInstance.viewType = SalesHierarchyViewType.roleGroups;
          componentInstance.tableRowData = tableRowData;
          let iconCSS: CssClasses = componentInstance.getRolegroupIconClass();
          expect(iconCSS).toEqual({'geography-group-icon': true, 'rolegroup-icon': false, 'account-group-icon': false});
        });
      });

      describe('when descriptionRow0 is neither GEOGRAPHY nor ACCOUNTS', () => {
        it('should return the geography-group CSS class', () => {
          let tableRowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
          tableRowData.descriptionRow0 = chance.string({length: 15});

          componentInstance.viewType = SalesHierarchyViewType.roleGroups;
          componentInstance.tableRowData = tableRowData;
          let iconCSS: CssClasses = componentInstance.getRolegroupIconClass();
          expect(iconCSS).toEqual({'geography-group-icon': false, 'rolegroup-icon': true, 'account-group-icon': false});
        });
      });

      describe('when descriptionRow0 is ACCOUNTS', () => {
        it('should return the account-group CSS class', () => {
          let tableRowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
          tableRowData.descriptionRow0 = 'ACCOUNTS';

          componentInstance.viewType = SalesHierarchyViewType.roleGroups;
          componentInstance.tableRowData = tableRowData;
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

  describe('getOpportunityCountClass', () => {
    it('should return "opportunities" class when opportunity count is greater than 0 for either brand or sku', () => {
      const tableRowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
      tableRowData.opportunities = chance.natural({min: 1});
      componentInstance.tableRowData = tableRowData;
      const opportunityCountClass: CssClasses = componentInstance.getOpportunityCountClass();
      expect(opportunityCountClass).toEqual({'opportunities': true , 'opportunities-error': false});
    });

    it('should return "opportunities" class when it is brand level and opportunity count is 0', () => {
      const tableRowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
      tableRowData.opportunities = 0;
      componentInstance.tableRowData = tableRowData;
      componentInstance.viewType = ProductMetricsViewType.brands;
      const opportunityCountClass: CssClasses = componentInstance.getOpportunityCountClass();
      expect(opportunityCountClass).toEqual({'opportunities': true , 'opportunities-error': false});
    });

    it('should return "opportunities-error" class when it is sku level there is opportunity error', () => {
      const tableRowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
      tableRowData.opportunities = undefined;
      componentInstance.tableRowData = tableRowData;
      componentInstance.isOpportunitiesError = true;
      componentInstance.viewType = ProductMetricsViewType.skus;
      const opportunityCountClass: CssClasses = componentInstance.getOpportunityCountClass();
      expect(opportunityCountClass).toEqual({'opportunities': false, 'opportunities-error': true});
    });

    it('should return "opportunities-error" class when it is brand level there is opportunity error', () => {
      const tableRowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
      tableRowData.opportunities = undefined;
      componentInstance.tableRowData = tableRowData;
      componentInstance.isOpportunitiesError = true;
      componentInstance.viewType = ProductMetricsViewType.brands;
      const opportunityCountClass: CssClasses = componentInstance.getOpportunityCountClass();
      expect(opportunityCountClass).toEqual({'opportunities': false, 'opportunities-error': true});
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

    beforeEach(() => {
      let tableRowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
      tableRowData.descriptionRow0 = 'STANDARD BEV CORP';
      componentInstance.tableRowData = tableRowData;
    });

    it('should not stop event propagation when an opportunity count is clicked when it is on brands level', () => {
      const opportunityCountClickedEventSpy = jasmine.createSpyObj('event', [ 'stopPropagation' ]);
      componentInstance.viewType = ProductMetricsViewType.brands;
      componentInstance.opportunityCountClicked(opportunityCountClickedEventSpy);
      fixture.detectChanges();
      expect(opportunityCountClickedEventSpy.stopPropagation).not.toHaveBeenCalled();
    });

    it('should stop event propagation when an opportunity count is clicked when it is not on brands level', () => {
      const opportunityCountClickedEventSpy = jasmine.createSpyObj('event', [ 'stopPropagation' ]);
      componentInstance.viewType = ProductMetricsViewType.skus;
      componentInstance.opportunityCountClicked(opportunityCountClickedEventSpy);
      fixture.detectChanges();
      expect(opportunityCountClickedEventSpy.stopPropagation).toHaveBeenCalled();
    });

    it('should stop event propagation when an opportunity count is clicked when opportunity count is "0"', () => {
      const opportunityCountClickedEventSpy = jasmine.createSpyObj('event', [ 'stopPropagation' ]);
      componentInstance.opportunityCountText = '0';
      componentInstance.opportunityCountClicked(opportunityCountClickedEventSpy);
      fixture.detectChanges();
      expect(opportunityCountClickedEventSpy.stopPropagation).toHaveBeenCalled();
    });

    it('should stop event propagation when an opportunity count is clicked when the view type is sku and' +
      'when opportunity count is "0"', () => {
      const opportunityCountClickedEventSpy = jasmine.createSpyObj('event', [ 'stopPropagation' ]);
      componentInstance.opportunityCountClicked(opportunityCountClickedEventSpy);
      componentInstance.viewType = ProductMetricsViewType.skus;
      componentInstance.opportunityCountText = '0';
      fixture.detectChanges();
      expect(opportunityCountClickedEventSpy.stopPropagation).toHaveBeenCalled();
    });

    it('should stop event propagation when an opportunity count is clicked when the view type is sku and' +
      'when opportunity count is not "0"', () => {
      const opportunityCountClickedEventSpy = jasmine.createSpyObj('event', [ 'stopPropagation' ]);
      componentInstance.viewType = ProductMetricsViewType.skus;
      componentInstance.opportunityCountText = '123';
      fixture.detectChanges();

      componentInstance.opportunityCountClicked(opportunityCountClickedEventSpy);
      expect(opportunityCountClickedEventSpy.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('showEmptyLastColumn Input', () => {
    beforeEach(() => {
      componentInstance.tableRowData = getMyPerformanceTableRowMock(1)[0];
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
      componentInstance.tableRowData = getMyPerformanceTableRowMock(1)[0];
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
      componentInstance.tableRowData.opportunities = 10;
      componentInstance.opportunitiesError = false;
      expect(componentInstance.opportunityCountText).toEqual('10');
    });
  });
});
