import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdCardModule } from '@angular/material';
import * as Chance from 'chance';

import { CompassCardComponent } from './compass-card.component';

const chance = new Chance();

describe('Compass Card Component', () => {
  let fixture: ComponentFixture<CompassCardComponent>;
  let componentInstance: CompassCardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MdCardModule ],
      declarations: [ CompassCardComponent ]
    });

    fixture = TestBed.createComponent(CompassCardComponent);
    componentInstance = fixture.componentInstance;
  });

  describe('component inputs', () => {
    it('should pass input data to its template', () => {
      const mockInputs = {
        title: chance.string(),
        mainAction: chance.string(),
        iconVisible: true
      };

      componentInstance.title = mockInputs.title;
      componentInstance.mainAction = mockInputs.mainAction;
      componentInstance.iconVisible = mockInputs.iconVisible;
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('md-card-title h3')).nativeElement;
      const iconClassElement = fixture.debugElement.query(By.css('.icon')).nativeElement;
      const mainActionElement = fixture.debugElement.queryAll(By.css('md-card-actions div'))[0].nativeElement;

      expect(titleElement.textContent).toBe(mockInputs.title);
      expect(iconClassElement.nodeName).toBe('H3');
      expect(mainActionElement.textContent).toBe(mockInputs.mainAction.toUpperCase());

      componentInstance.iconVisible = !mockInputs.iconVisible;
      fixture.detectChanges();

      const iconClassElementHidden = fixture.debugElement.query(By.css('.icon'));
      expect(iconClassElementHidden).toBe(null);
    });
  });

  describe('component outputs', () => {
    it('should output events', (done) => {
      componentInstance.mainAction = chance.string();
      fixture.detectChanges();

      componentInstance.onMainActionClicked.subscribe(() => {
        done();
      });

      fixture.debugElement.queryAll(By.css('md-card-actions div'))[0].triggerEventHandler('click', null);
    });
  });
});
