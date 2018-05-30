import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material';

import { CompassDropdownDirective } from '../../../directives/compass-dropdown.directive';
import { CompassDropdownService } from '../../../services/compass-dropdown.service';
import { CompassTooltipComponent } from '../compass-tooltip/compass-tooltip.component';
import { CompassTooltipService } from '../../../services/compass-tooltip.service';
import { getListTableDrawerRowMock } from '../../../models/lists/list-table-drawer-row.model.mock';
import { ListTableDrawerComponent } from './list-table-drawer.component';
import { ListTableDrawerRow } from '../../../models/lists/list-table-drawer-row.model';
import { OpportunityImpact } from '../../../enums/list-opportunities/list-opportunity-impact.enum';

const chance = new Chance();

describe('ListTableDrawerComponent', () => {
  let fixture: ComponentFixture<ListTableDrawerComponent>;
  let componentInstance: ListTableDrawerComponent;

  let tableDataMock: ListTableDrawerRow[];
  let compassDropdownServiceMock: CompassDropdownService;
  const compassTooltipServiceMock = {
    showTooltip: jasmine.createSpy('showTooltip')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompassDropdownDirective,
        CompassTooltipComponent,
        ListTableDrawerComponent
      ],
      imports: [
        MatCheckboxModule
      ],
      providers: [{
        provide: CompassTooltipService,
        useValue: compassTooltipServiceMock
      }, {
        provide: CompassDropdownService,
        useValue: compassDropdownServiceMock
      }]
    });

    fixture = TestBed.createComponent(ListTableDrawerComponent);
    componentInstance = fixture.componentInstance;
    tableDataMock = Array(3).fill('').map(() => getListTableDrawerRowMock());

    componentInstance.tableData = tableDataMock;

    fixture.detectChanges();
  });

  describe('component init', () => {
    it('should sort the table rows based on row impact, descending from high to low', () => {
      tableDataMock[0].impact = OpportunityImpact.low;
      tableDataMock[1].impact = OpportunityImpact.medium;
      tableDataMock[2].impact = OpportunityImpact.high;

      componentInstance.tableData = tableDataMock;

      fixture.detectChanges();

      expect(componentInstance.sortedTableData[0].impact).toBe(OpportunityImpact.high);
      expect(componentInstance.sortedTableData[1].impact).toBe(OpportunityImpact.medium);
      expect(componentInstance.sortedTableData[2].impact).toBe(OpportunityImpact.low);
    });

    it('should sort the table rows based on brand name when rows contains the same impact', () => {
      const brandOneMock: string = `X${ chance.string() }`;
      const brandTwoMock: string = `Y${ chance.string() }`;
      const brandThreeMock: string = `Z${ chance.string() }`;

      tableDataMock[0].brand = brandTwoMock;
      tableDataMock[1].brand = brandThreeMock;
      tableDataMock[2].brand = brandOneMock;
      tableDataMock.forEach((tableRow: ListTableDrawerRow, index: number) => {
        tableRow.impact = OpportunityImpact.high;
      });

      componentInstance.tableData = tableDataMock;

      fixture.detectChanges();

      expect(componentInstance.sortedTableData[0].brand).toBe(brandOneMock);
      expect(componentInstance.sortedTableData[1].brand).toBe(brandTwoMock);
      expect(componentInstance.sortedTableData[2].brand).toBe(brandThreeMock);
    });
  });

  describe('output events', () => {

    describe('when the mat-checkbox outputs a change event and calls checkboxClicked', () => {
      it('should toggle the row`s checked field based on the passed in boolean and index values and emit an onCheckboxClicked event'
      + ' with no event value', (done) => {
        componentInstance.onCheckboxClicked.subscribe((event: Event) => {
          expect(event).toBe(undefined);
          done();
        });

        componentInstance.checkboxClicked(true, 1);
        fixture.detectChanges();

        expect(componentInstance.sortedTableData[1].checked).toBe(true);

        componentInstance.checkboxClicked(false, 1);
        fixture.detectChanges();

        expect(componentInstance.sortedTableData[1].checked).toBe(false);
      });
    });

    describe('when the row opportunity type is clicked', () => {
      it('should emit an onOpportunityTypeClicked event containing the clicked row', (done) => {
        componentInstance.onOpportunityTypeClicked.subscribe((event: string) => {
          expect(event).toEqual(componentInstance.sortedTableData[0].id);
          done();
        });

        fixture.debugElement.queryAll(By.css('.type-column'))[0].nativeElement.click();
        fixture.detectChanges();
      });
    });
  });
});
