import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as Chance from 'chance';

import { CompassTooltipComponent } from '../compass-tooltip/compass-tooltip.component';
import { CompassTooltipObject } from '../../../models/compass-tooltip-component.model';
import { getTooltipMock } from '../../../models/compass-tooltip.model.mock';
import { getTeamPerformanceTableOpportunitiesMock } from '../../../models/my-performance-table-row.model.mock';
import { TeamPerformanceOpportunitiesComponent } from './team-performance-opportunities.component';
import { TeamPerformanceTableOpportunity } from '../../../models/my-performance-table-row.model';

const chance = new Chance();

describe('Team Performance Opportunities Component', () => {
  let fixture: ComponentFixture<TeamPerformanceOpportunitiesComponent>;
  let componentInstance: TeamPerformanceOpportunitiesComponent;

  let opportunitiesMock: Array<TeamPerformanceTableOpportunity>;
  let tooltipMock: CompassTooltipObject;
  let opportunitiesTotalMock: number;
  let premiseTypeMock: string;
  let productNameMock: string;
  let subtitleMock: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPerformanceOpportunitiesComponent, CompassTooltipComponent ]
    });

    fixture = TestBed.createComponent(TeamPerformanceOpportunitiesComponent);
    componentInstance = fixture.componentInstance;

    opportunitiesMock = getTeamPerformanceTableOpportunitiesMock();
    tooltipMock = getTooltipMock();
    opportunitiesTotalMock = chance.natural();
    productNameMock = chance.string();
    premiseTypeMock = chance.string();
    subtitleMock = chance.string();

    componentInstance.opportunities = opportunitiesMock;
    componentInstance.premiseType = premiseTypeMock;
    componentInstance.productName = productNameMock;
    componentInstance.subtitle = subtitleMock;
    componentInstance.total = opportunitiesTotalMock;
    componentInstance.tooltip = tooltipMock;

    fixture.detectChanges();
  });

  describe('component init', () => {
    it('should display the passed in subtitle', () => {
      const subtitleElement = fixture.debugElement.query(By.css('.header-sub-title')).nativeElement;

      expect(subtitleElement.textContent).toBe(subtitleMock);
    });

    it('should display the passed in product name', () => {
      const productNameElement = fixture.debugElement.query(By.css('.product-name')).nativeElement;

      expect(productNameElement.textContent).toBe(productNameMock);
    });

    it('should display the passed in premise type with `Opportunities` appended after it', () => {
      const expectedPremiseTypeTextContent = premiseTypeMock + ' Opportunities';
      const premiseTypeElement = fixture.debugElement.query(By.css('.product-premise-type')).nativeElement;

      expect(premiseTypeElement.textContent).toBe(expectedPremiseTypeTextContent);
    });

    it('should display the passed in total value', () => {
      const totalElement = fixture.debugElement.query(By.css('.total-row-value')).nativeElement;

      expect(totalElement.textContent).toBe(opportunitiesTotalMock.toString());
    });

    it('should contain an opportunity row for each passed in opportunity', () => {
      const expectedOpportunityElementCount = opportunitiesMock.length + 1; // Factor in total row
      const opportunityRowElements = fixture.debugElement.queryAll(By.css('.opportunity-row'));

      expect(expectedOpportunityElementCount).toBe(opportunityRowElements.length);

      opportunityRowElements.forEach((opportunityRow, index) => {
        if (index < opportunitiesMock.length) {
          const childDivs = opportunityRow.queryAll(By.css('div'));

          expect(childDivs[0].nativeElement.textContent).toBe(opportunitiesMock[index].name);
          expect(childDivs[1].nativeElement.textContent).toBe(opportunitiesMock[index].count.toString());
        }
      });
    });
  });

  describe('output events', () => {
    it('should emit an event with no value when the `X` element is clicked', (done) => {
      componentInstance.onCloseIndicatorClicked.subscribe((value: any) => {
        expect(value).toBe(undefined);
        done();
      });

      fixture.debugElement.query(By.css('.close-indicator')).nativeElement.click();
    });

    it('should emit an event containing the opportunity whose value cell was clicked', (done) => {
      componentInstance.onOpportunityCountClicked.subscribe((value: TeamPerformanceTableOpportunity) => {
        expect(value).toBe(opportunitiesMock[0]);
        done();
      });

      fixture.debugElement.query(By.css('.opportunity-row div:last-child')).nativeElement.click();
    });
  });
});
