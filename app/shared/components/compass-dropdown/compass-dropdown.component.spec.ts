import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { CompassDropdownComponent } from './compass-dropdown.component';
import { CompassDropdownItem } from '../../../models/compass-dropdown-item.model';
import { CssStyles } from '../../../models/css-styles.model';
import { getCompassDropdownItemArrayMock } from '../../../models/compass-dropdown-item.model.mock';

const chance = new Chance();

describe('Compass Dropdown Component', () => {
  let fixture: ComponentFixture<CompassDropdownComponent>;
  let componentInstance: CompassDropdownComponent;

  let compassDropdownItemsMock: CompassDropdownItem[];
  let compassDropdownStylesMock: CssStyles;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CompassDropdownComponent ]
    });

    fixture = TestBed.createComponent(CompassDropdownComponent);
    componentInstance = fixture.componentInstance;

    compassDropdownItemsMock = getCompassDropdownItemArrayMock();
    compassDropdownStylesMock = {
      width: chance.integer({ min: 10, max: 1000 })
    };

    componentInstance.compassDropdownItems = compassDropdownItemsMock;
    fixture.detectChanges();
  });

  describe('Component Inputs', () => {
    it('should contain a dropdown item for every CompassDropdownItem passed into the component', () => {
      const dropdownItems: DebugElement[] = fixture.debugElement.queryAll(By.css('.compass-dropdown-option'));

      expect(dropdownItems.length).toBe(compassDropdownItemsMock.length);

      dropdownItems.forEach((dropdownItem: DebugElement, index: number) => {
        expect(dropdownItem.nativeElement.textContent).toBe(compassDropdownItemsMock[index].display);
      });
    });
  });

  describe('Component Outputs', () => {
    it('should output an onCompassDropdownClicked event containing the value of the clicked dropdown item', (done) => {
      const dropdownItems: DebugElement[] = fixture.debugElement.queryAll(By.css('.compass-dropdown-option'));
      const randomDropdownIndex: number = chance.integer({ min: 0, max: compassDropdownItemsMock.length - 1 });

      componentInstance.onCompassDropdownClicked.subscribe((value: string) => {
        expect(value).toEqual(compassDropdownItemsMock[randomDropdownIndex].value);
        done();
      });

      const randomDropdownElement = dropdownItems[randomDropdownIndex];
      randomDropdownElement.nativeElement.click();
      fixture.detectChanges();
    });
  });
});
