import { TestBed, ComponentFixture } from '@angular/core/testing';

import { CssClasses } from '../../../models/css-classes.model';
import { getMyPerformanceTableRowMock } from '../../../models/my-performance-table-row.model.mock';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';
import { MyPerformanceTableRowComponent } from './my-performance-table-row.component';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';

describe('MyPerformanceTableComponent', () => {

  let fixture: ComponentFixture<MyPerformanceTableRowComponent>;
  let componentInstance: MyPerformanceTableRowComponent;

  let ieHackServiceMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyPerformanceTableRowComponent
      ],
      providers: [
        {
          provide: 'ieHackService',
          useValue: ieHackServiceMock
        }
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
});