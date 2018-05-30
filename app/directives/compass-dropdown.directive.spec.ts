import { By } from '@angular/platform-browser';
import { Component, DebugElement, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassDropdownData } from '../models/compass-dropdown-data.model';
import { CompassDropdownDirective, COMPASS_DROPDOWN_OVERLAY_CONFIG, COMPASS_DROPDOWN_POSITION_CONFIG } from './compass-dropdown.directive';
import { CompassDropdownService } from '../services/compass-dropdown.service';
import { getCompassDropdownItemArrayMock } from '../models/compass-dropdown-item.model.mock';

class TestComponentBase {
  compassDropdownDataMock: CompassDropdownData;

  constructor() {
    this.compassDropdownDataMock = {
      data: getCompassDropdownItemArrayMock()
    };
  }
}

@Component({
  template: `<p compassDropdown [compassDropdownData]="compassDropdownDataMock">Test Component A</p>`
})
class TestComponentA extends TestComponentBase { }

@Component({
  template: `<p compassDropdown [compassDropdownData]="compassDropdownDataMock" [compassDropdownDisabled]="true">Test Component B</p>`
})
class TestComponentB extends TestComponentBase { }

describe('CompassDropdownDirective', () => {
  const compassDropdownServiceMock: any = {
    showDropdown: jasmine.createSpy('showDropdown')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompassDropdownDirective,
        TestComponentA,
        TestComponentB
      ],
      providers: [{
        provide: CompassDropdownService,
        useValue: compassDropdownServiceMock
      }]
    });
  });

  afterEach(() => {
    compassDropdownServiceMock.showDropdown.calls.reset();
  });

  describe('default functionality', () => {
    let fixture: ComponentFixture<TestComponentA>;
    let elementInstance: TestComponentA;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponentA);
      elementInstance = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should reach out to the CompassDropdownService when the host element is clicked', () => {
      expect(compassDropdownServiceMock.showDropdown).not.toHaveBeenCalled();

      const element: DebugElement = fixture.debugElement.query(By.css('p'));
      element.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(compassDropdownServiceMock.showDropdown).toHaveBeenCalledWith(
        new ElementRef(element.nativeElement),
        elementInstance.compassDropdownDataMock,
        COMPASS_DROPDOWN_POSITION_CONFIG,
        COMPASS_DROPDOWN_OVERLAY_CONFIG
      );
    });
  });

  describe('custom/optional functionality', () => {

    describe('when the compassDropdownDisabled input is added with a boolean of true', () => {
      let fixture: ComponentFixture<TestComponentB>;
      let elementInstance: TestComponentB;

      beforeEach(() => {
        fixture = TestBed.createComponent(TestComponentB);
        elementInstance = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should disable opening the dropdown when the host element is clicked', () => {
        expect(compassDropdownServiceMock.showDropdown).not.toHaveBeenCalled();

        const element: DebugElement = fixture.debugElement.query(By.css('p'));
        element.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(compassDropdownServiceMock.showDropdown).not.toHaveBeenCalled();
      });
    });
  });
});
