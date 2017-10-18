
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdCardModule } from '@angular/material';
import * as Chance from 'chance';

import { BreadcrumbEntityClickedEvent } from '../../../models/breadcrumb-entity-clicked-event.model';
import { getMyPerformanceStateMock } from '../../../state/reducers/my-performance.state.mock';
import { MyPerformanceState, initialState } from '../../../state/reducers/my-performance.reducer';
import { MyPerformanceBreadcrumbComponent } from './my-performance-breadcrumb.component';

const chance = new Chance();

fdescribe('Breadcrumb Component', () => {
  let fixture: ComponentFixture<MyPerformanceBreadcrumbComponent>;
  let componentInstance: MyPerformanceBreadcrumbComponent;
  let myPerformanceStateMock: MyPerformanceState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MdCardModule ],
      declarations: [ MyPerformanceBreadcrumbComponent ],
      providers: []
    });

    fixture = TestBed.createComponent(MyPerformanceBreadcrumbComponent);
    componentInstance = fixture.componentInstance;
    myPerformanceStateMock = getMyPerformanceStateMock();
  });

  describe('inputs', () => {
    it('should translate inputs into breadcrumb trail with initial performance state', () => {
      const mockInputs = {
        currentUserFullName: chance.string(),
        performanceStateVersions: initialState.versions,
        showBackButton: chance.bool()
      };

      componentInstance.currentUserFullName = mockInputs.currentUserFullName;
      componentInstance.performanceStateVersions = mockInputs.performanceStateVersions;
      componentInstance.showBackButton = mockInputs.showBackButton;

        fixture.detectChanges();

      const breadcrumbContainer = fixture.debugElement.query(By.css('.breadcrumb-container')).nativeElement;

      expect(breadcrumbContainer.textContent).toBe(`${mockInputs.currentUserFullName}`);
    });

    it('should translate inputs into breadcrumb trail with initial performance state', () => {
      const mockInputs = {
        currentUserFullName: chance.string(),
        performanceStateVersions: myPerformanceStateMock.versions,
        showBackButton: chance.bool()
      };

      componentInstance.currentUserFullName = mockInputs.currentUserFullName;
      componentInstance.performanceStateVersions = mockInputs.performanceStateVersions;
      componentInstance.showBackButton = mockInputs.showBackButton;

      fixture.detectChanges();

      const breadcrumbContainer = fixture.debugElement.query(By.css('.breadcrumb-container')).nativeElement;

      expect(breadcrumbContainer.textContent).toBe(
        `${mockInputs.currentUserFullName + mockInputs.performanceStateVersions.map(version => version.selectedEntity).join('')}`);
    });
  });

  describe('component outputs', () => {
    it('should output proper event when breadcrumb entity is clicked', (done) => {
      const mockInputs = {
        currentUserFullName: chance.string(),
        performanceStateVersions: myPerformanceStateMock.versions,
        showBackButton: chance.bool()
      };

      componentInstance.currentUserFullName = mockInputs.currentUserFullName;
      componentInstance.performanceStateVersions = mockInputs.performanceStateVersions;
      componentInstance.showBackButton = mockInputs.showBackButton;

      const breadcrumbEntityIndexToClick = chance.natural({min: 0, max: mockInputs.performanceStateVersions.length});

      fixture.detectChanges();

      componentInstance.breadcrumbEntityClicked.subscribe((event: BreadcrumbEntityClickedEvent) => {
        const expectedBreadcrumbTrail =
          [ mockInputs.currentUserFullName ].concat(myPerformanceStateMock.versions.map(version => version.selectedEntity));
        expect(event).toEqual({trail: expectedBreadcrumbTrail, entity: expectedBreadcrumbTrail[breadcrumbEntityIndexToClick]});
        done();
      });

      fixture.debugElement.queryAll(By.css('.breadcrumb-entity'))
        [breadcrumbEntityIndexToClick].triggerEventHandler('click', null);
    });
  });

  describe('return proper class for back button', () => {
    it('should return the back button class', () => {
      const mockInputs = {
        currentUserFullName: chance.string(),
        performanceStateVersions: myPerformanceStateMock.versions,
        showBackButton: chance.bool()
      };

      componentInstance.currentUserFullName = mockInputs.currentUserFullName;
      componentInstance.performanceStateVersions = mockInputs.performanceStateVersions;
      componentInstance.showBackButton = true;

      fixture.detectChanges();

      const backButtonClass = componentInstance.getBackButtonClass();
      expect(backButtonClass).toEqual({'back-button': true});
    });
  });
});
