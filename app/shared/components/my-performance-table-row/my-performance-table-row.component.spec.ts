import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MyPerformanceTableRowComponent } from './my-performance-table-row.component';
import { SalesHierarchyViewType } from '../../../enums/sales-hierarchy-view-type.enum';
import { CssClasses } from '../../../models/css-classes.model';
import { getMyPerformanceTableRowMock } from '../../../models/my-performance-table-row.model.mock';
import { MyPerformanceTableRow } from '../../../models/my-performance-table-row.model';

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
          expect(iconCSS).toEqual({'geography-group': true, 'rolegroup': false, 'account-group': false});
        });
      });

      describe('when descriptionRow0 is neither GEOGRAPHY nor ACCOUNTS', () => {
        it('should return the geography-group CSS class', () => {
          let rowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
          rowData.descriptionRow0 = chance.string({length: 15});

          componentInstance.viewType = SalesHierarchyViewType.roleGroups;
          componentInstance.rowData = rowData;
          let iconCSS: CssClasses = componentInstance.getRolegroupIconClass();
          expect(iconCSS).toEqual({'geography-group': false, 'rolegroup': true, 'account-group': false});
        });
      });

      describe('when descriptionRow0 is ACCOUNTS', () => {
        it('should return the account-group CSS class', () => {
          let rowData: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
          rowData.descriptionRow0 = 'ACCOUNTS';

          componentInstance.viewType = SalesHierarchyViewType.roleGroups;
          componentInstance.rowData = rowData;
          let iconCSS: CssClasses = componentInstance.getRolegroupIconClass();
          expect(iconCSS).toEqual({'geography-group': false, 'rolegroup': false, 'account-group': true});
        });
      });
    });
  });

});
