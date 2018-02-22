import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material';
import * as Chance from 'chance';

import { AnalyticsService } from '../../../services/analytics.service';
import { CompassCardComponent } from './compass-card.component';

const chance = new Chance();

describe('Compass Card Component', () => {
  let fixture: ComponentFixture<CompassCardComponent>;
  let componentInstance: CompassCardComponent;
  let analyticsServiceMock: any;

  beforeEach(() => {
    analyticsServiceMock = jasmine.createSpyObj(['trackEvent']);
    TestBed.configureTestingModule({
      imports: [ MatCardModule ],
      declarations: [ CompassCardComponent ],
      providers: [
        {
          provide: AnalyticsService,
          useValue: analyticsServiceMock
        }
      ]
    });

    fixture = TestBed.createComponent(CompassCardComponent);
    componentInstance = fixture.componentInstance;
  });

  describe('component inputs', () => {
    it('should pass input data to its template', () => {
      const inputMock = {
        analyticsProperties: {label: 'mockLabel', category: 'mockCategory'},
        image: 'product',
        title: chance.string(),
        mainAction: chance.string()
      };

      componentInstance.analyticsProperties = inputMock.analyticsProperties;
      componentInstance.title = inputMock.title;
      componentInstance.mainAction = inputMock.mainAction;
      componentInstance.image = inputMock.image;
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('mat-card-title')).nativeElement;
      const mainActionElement = fixture.debugElement.queryAll(By.css('mat-card-actions div'))[0].nativeElement;

      expect(titleElement.textContent).toBe(inputMock.title);
      expect(mainActionElement.textContent).toBe(inputMock.mainAction.toUpperCase());

      fixture.detectChanges();
    });
  });

  describe('component outputs', () => {
    it('should output events', (done) => {
      componentInstance.mainAction = chance.string();
      fixture.detectChanges();

      componentInstance.onMainActionClicked.subscribe(() => {
        done();
      });

      fixture.debugElement.queryAll(By.css('mat-card-actions div'))[0].triggerEventHandler('click', null);
    });
  });

  describe('optionMainActionClicked', () => {
    it('should trigger analytics when analyticsProperties are provided as inputs', () => {
      componentInstance.analyticsProperties = {label: 'labelMock', category: 'categoryMock'};
      componentInstance.optionMainActionClicked();
      expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith(
        'categoryMock',
        'Link Click',
        'labelMock'
      );
    });
    it('should not trigger analytics when no analyticsProperties are provided as inputs', () => {
      componentInstance.optionMainActionClicked();
      expect(analyticsServiceMock.trackEvent).not.toHaveBeenCalled();
    });
  });
});
