import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompassTabsComponent } from './compass-tabs.component';
import { TabComponent } from './tab/tab.component';

describe('CompassTabsComponent', () => {

  @Component({
    selector: 'test-component',
    template: `
      <compass-tabs>
        <compass-tab [tabTitle]="'Tab1'">
          <div> tab 1 content </div>
        </compass-tab>
        <compass-tab [tabTitle]="'Tab2'">
          <div> tab 2 content </div>
        </compass-tab>
      </compass-tabs>
    `
  })
  class TestComponent { }

  let fixture: ComponentFixture<TestComponent>;
  let componentInstance: TestComponent;

  let tabsContainerComponent: CompassTabsComponent;
  let tab1Component: TabComponent;
  let tab2Component: TabComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompassTabsComponent,
        TabComponent,
        TestComponent
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    componentInstance = fixture.componentInstance;

    fixture.detectChanges();
    tabsContainerComponent = fixture.debugElement.children[0].componentInstance;
    tab1Component = tabsContainerComponent.tabs.first;
    tab2Component = tabsContainerComponent.tabs.last;
  });
  describe('afterContentInit', () => {
    it('should set the first tab to active by default', () => {
      expect(tab1Component.active).toBeTruthy();
    });
  });

  describe('selectTab', () => {
    it('should set the selected tab to active, and reset all other tabs to inactive', () => {
      expect(tab2Component.active).toBeFalsy();
      tabsContainerComponent.selectTab(tab2Component);
      expect(tab2Component.active).toBeTruthy();
    });
  });
});
