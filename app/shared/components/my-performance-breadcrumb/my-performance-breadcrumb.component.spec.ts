import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdCardModule } from '@angular/material';
import * as Chance from 'chance';

import { BreadcrumbEntityClickedEvent } from '../../../models/breadcrumb-entity-clicked-event.model';
import { getMyPerformanceEntitiesDataMock } from '../../../state/reducers/my-performance.state.mock';
import { MyPerformanceEntitiesData } from '../../../state/reducers/my-performance.reducer';
import { MyPerformanceBreadcrumbComponent } from './my-performance-breadcrumb.component';
import { SimpleChange } from '@angular/core';

const chance = new Chance();

describe('Breadcrumb Component', () => {
  let fixture: ComponentFixture<MyPerformanceBreadcrumbComponent>;
  let componentInstance: MyPerformanceBreadcrumbComponent;
  let currentStateMock: MyPerformanceEntitiesData;
  let versionsMock: MyPerformanceEntitiesData[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MdCardModule ],
      declarations: [ MyPerformanceBreadcrumbComponent ],
      providers: []
    });

    fixture = TestBed.createComponent(MyPerformanceBreadcrumbComponent);
    componentInstance = fixture.componentInstance;

    currentStateMock = getMyPerformanceEntitiesDataMock();
    versionsMock = Array(chance.natural({min: 1, max: 9}))
      .fill('')
      .map(element => getMyPerformanceEntitiesDataMock());
  });

  describe('component inputs', () => {
    it('should render empty breadcrumb trail before inputs have been set', () => {
      fixture.detectChanges();

      const breadcrumbContainer = fixture.debugElement.query(By.css('.breadcrumb-container')).nativeElement;
      const breadcrumbEntities = fixture.debugElement.queryAll(By.css('.breadcrumb-entity'));
      expect(breadcrumbContainer.textContent).toBe('');
      expect(breadcrumbEntities.length).toBe(0);
    });

    it('should render current state only in breadcrumb trail when versions are empty', () => {
      componentInstance.currentPerformanceState = currentStateMock;
      componentInstance.performanceStateVersions = [];
      componentInstance.showBackButton = true;
      fixture.detectChanges();
      const breadcrumbContainer = fixture.debugElement.query(By.css('.breadcrumb-container')).nativeElement;
      const breadcrumbEntities = fixture.debugElement.queryAll(By.css('.breadcrumb-entity'));

      expect(breadcrumbContainer.textContent).toBe(currentStateMock.selectedEntityDescription);
      expect(breadcrumbEntities.length).toBe(1);
    });

    it('should render initial versions and initial current state description in breadcrumb trail', () => {
      componentInstance.currentPerformanceState = currentStateMock;
      componentInstance.performanceStateVersions = versionsMock;
      componentInstance.showBackButton = true;
      fixture.detectChanges();
      const breadcrumbContainer = fixture.debugElement.query(By.css('.breadcrumb-container')).nativeElement;
      const breadcrumbEntities = fixture.debugElement.queryAll(By.css('.breadcrumb-entity'));

      const expectedVersionTrail: string = versionsMock.reduce((trail: string, version: MyPerformanceEntitiesData) => {
        return trail + version.selectedEntityDescription;
      }, '');
      const expectedTrail = expectedVersionTrail + currentStateMock.selectedEntityDescription;
      expect(breadcrumbContainer.textContent).toBe(expectedTrail);
      expect(breadcrumbEntities.length).toBe(versionsMock.length + 1);
    });

    it('should render changed versions and initial current state description in breadcrumb trail when ngOnChanges fires', () => {
      componentInstance.currentPerformanceState = currentStateMock;
      componentInstance.performanceStateVersions = versionsMock;
      componentInstance.showBackButton = true;
      fixture.detectChanges();
      const breadcrumbContainer = fixture.debugElement.query(By.css('.breadcrumb-container')).nativeElement;
      let breadcrumbEntities = fixture.debugElement.queryAll(By.css('.breadcrumb-entity'));

      const expectedInitialVersionTrail: string = versionsMock.reduce((trail: string, version: MyPerformanceEntitiesData) => {
        return trail + version.selectedEntityDescription;
      }, '');
      const expectedInitialTrail = expectedInitialVersionTrail + currentStateMock.selectedEntityDescription;
      expect(breadcrumbContainer.textContent).toBe(expectedInitialTrail);
      expect(breadcrumbEntities.length).toBe(versionsMock.length + 1);

      let changedVersionsMock = Array(chance.natural({ min: 0, max: 9 }))
        .fill('')
        .map(element => getMyPerformanceEntitiesDataMock());
      componentInstance.ngOnChanges({
        performanceStateVersions: new SimpleChange(null, changedVersionsMock, true)
      });
      fixture.detectChanges();

      const expectedChangedVersionTrail: string = changedVersionsMock.reduce((trail: string, version: MyPerformanceEntitiesData) => {
        return trail + version.selectedEntityDescription;
      }, '');
      const expectedChangedTrail = expectedChangedVersionTrail + currentStateMock.selectedEntityDescription;
      expect(breadcrumbContainer.textContent).toBe(expectedChangedTrail);
      breadcrumbEntities = fixture.debugElement.queryAll(By.css('.breadcrumb-entity'));
      expect(breadcrumbEntities.length).toBe(changedVersionsMock.length + 1);
    });

    it('should render initial versions and changed current state description in breadcrumb trail when ngOnChanges fires', () => {
      componentInstance.currentPerformanceState = currentStateMock;
      componentInstance.performanceStateVersions = versionsMock;
      componentInstance.showBackButton = true;
      fixture.detectChanges();
      const breadcrumbContainer = fixture.debugElement.query(By.css('.breadcrumb-container')).nativeElement;
      let breadcrumbEntities = fixture.debugElement.queryAll(By.css('.breadcrumb-entity'));

      const expectedVersionTrail: string = versionsMock.reduce((trail: string, version: MyPerformanceEntitiesData) => {
        return trail + version.selectedEntityDescription;
      }, '');
      const expectedInitialTrail = expectedVersionTrail + currentStateMock.selectedEntityDescription;
      expect(breadcrumbContainer.textContent).toBe(expectedInitialTrail);
      expect(breadcrumbEntities.length).toBe(versionsMock.length + 1);

      let changedCurrentStateMock = getMyPerformanceEntitiesDataMock();
      componentInstance.ngOnChanges({
        currentPerformanceState: new SimpleChange(null, changedCurrentStateMock, true)
      });
      fixture.detectChanges();

      const expectedChangedTrail = expectedVersionTrail + changedCurrentStateMock.selectedEntityDescription;
      expect(breadcrumbContainer.textContent).toBe(expectedChangedTrail);
      breadcrumbEntities = fixture.debugElement.queryAll(By.css('.breadcrumb-entity'));
      expect(breadcrumbEntities.length).toBe(versionsMock.length + 1);
    });

    it('should render changed versions and changed current state description in breadcrumb trail when ngOnChanges fires', () => {
      componentInstance.currentPerformanceState = currentStateMock;
      componentInstance.performanceStateVersions = versionsMock;
      componentInstance.showBackButton = true;
      fixture.detectChanges();
      const breadcrumbContainer = fixture.debugElement.query(By.css('.breadcrumb-container')).nativeElement;
      let breadcrumbEntities = fixture.debugElement.queryAll(By.css('.breadcrumb-entity'));

      const expectedInitialVersionTrail: string = versionsMock.reduce((trail: string, version: MyPerformanceEntitiesData) => {
        return trail + version.selectedEntityDescription;
      }, '');
      const expectedInitialTrail = expectedInitialVersionTrail + currentStateMock.selectedEntityDescription;
      expect(breadcrumbContainer.textContent).toBe(expectedInitialTrail);
      expect(breadcrumbEntities.length).toBe(versionsMock.length + 1);

      let changedCurrentStateMock = getMyPerformanceEntitiesDataMock();
      let changedVersionsMock = Array(chance.natural({ min: 0, max: 9 }))
        .fill('')
        .map(element => getMyPerformanceEntitiesDataMock());

      componentInstance.ngOnChanges({
        currentPerformanceState: new SimpleChange(null, changedCurrentStateMock, true),
        performanceStateVersions: new SimpleChange(null, changedVersionsMock, true)
      });
      fixture.detectChanges();

      const expectedChangedVersionTrail: string = changedVersionsMock.reduce((trail: string, version: MyPerformanceEntitiesData) => {
        return trail + version.selectedEntityDescription;
      }, '');
      const expectedChangedTrail = expectedChangedVersionTrail + changedCurrentStateMock.selectedEntityDescription;
      expect(breadcrumbContainer.textContent).toBe(expectedChangedTrail);
      breadcrumbEntities = fixture.debugElement.queryAll(By.css('.breadcrumb-entity'));
      expect(breadcrumbEntities.length).toBe(changedVersionsMock.length + 1);
    });
  });

  describe('component outputs', () => {
    it('should output proper event when breadcrumb entity is clicked', (done) => {
      componentInstance.currentPerformanceState = currentStateMock;
      componentInstance.performanceStateVersions = versionsMock;
      componentInstance.showBackButton = true;
      fixture.detectChanges();

      const expectedVersionTrail: string[] = versionsMock.map((version: MyPerformanceEntitiesData) => {
        return version.selectedEntityDescription;
      });
      const expectedBreadcrumbTrail: string[] = expectedVersionTrail.concat([currentStateMock.selectedEntityDescription]);
      const breadcrumbEntityIndexToClick = chance.natural({min: 0, max: versionsMock.length});

      componentInstance.breadcrumbEntityClicked.subscribe((event: BreadcrumbEntityClickedEvent) => {
        expect(event).toEqual({trail: expectedBreadcrumbTrail, entityDescription: expectedBreadcrumbTrail[breadcrumbEntityIndexToClick]});
        done();
      });

      fixture.debugElement.queryAll(By.css('.breadcrumb-entity'))
        [breadcrumbEntityIndexToClick].triggerEventHandler('click', null);
    });

    it('should output proper event when back button is clicked', (done) => {
      componentInstance.currentPerformanceState = currentStateMock;
      componentInstance.performanceStateVersions = versionsMock;
      componentInstance.showBackButton = true;
      fixture.detectChanges();

      componentInstance.backButtonClicked.subscribe(() => {
        done();
      });

      fixture.debugElement.query(By.css('.back-button')).triggerEventHandler('click', null);
    });
  });

  describe('return proper class for back button', () => {
    it('should return the back button class when showBackButton is true', () => {
      componentInstance.currentPerformanceState = currentStateMock;
      componentInstance.performanceStateVersions = versionsMock;
      componentInstance.showBackButton = true;
      fixture.detectChanges();

      const backButtonClass = componentInstance.getBackButtonClass();
      expect(backButtonClass).toEqual({'back-button': true});
    });

    it('should not return the back button class when showBackButton is false', () => {
      componentInstance.currentPerformanceState = currentStateMock;
      componentInstance.performanceStateVersions = versionsMock;
      componentInstance.showBackButton = false;
      fixture.detectChanges();

      const backButtonClass = componentInstance.getBackButtonClass();
      expect(backButtonClass).toEqual({'back-button': false});
    });
  });
});
