import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabComponent } from './tab.component';

const chance = new Chance();

describe('TabComponent', () => {

  let fixture: ComponentFixture<TabComponent>;
  let componentInstance: TabComponent;
  let tabElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TabComponent ]
    });

    fixture = TestBed.createComponent(TabComponent);
    componentInstance = fixture.componentInstance;
    tabElement = fixture.debugElement.nativeElement.querySelector('div');
  });

  describe('inputs', () => {
    it('should default the active input to false', () => {
      expect(componentInstance.active).toBeFalsy();
    });

    it('should be hidden when active input is set to false', () => {
      fixture.detectChanges();
      expect(tabElement.attributes.hidden).toBeTruthy();
    });

    it('should not be hidden when active input is set to true', () => {
      componentInstance.active = true;
      fixture.detectChanges();
      expect(tabElement.attributes.hidden).toBeFalsy();
    });

    it('should set the id to the tab title', () => {
      const titleMock = chance.string();
      componentInstance.title = titleMock;
      fixture.detectChanges();
      expect(tabElement.id).toBe(titleMock);
    });
  });
});
