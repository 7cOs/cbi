import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbiSelectComponent } from './cbi-select.component';
import { FormsModule } from '@angular/forms';
import { MdSelectModule } from '@angular/material';
import * as Chance from 'chance';

const chance = new Chance();

const inputModels = {
  options: [{ name: chance.string(), value: chance.string(), subValue: chance.string() },
            { name: chance.string(), value: chance.string(), subValue: chance.string() }],
  displayKey: 'name',
  valueKey: 'value',
  subDisplayKey: 'subValue',
  title: chance.string()
};

describe('CbiSelectComponent', () => {

  let fixture: ComponentFixture<CbiSelectComponent>;
  let componentInstance: CbiSelectComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, FormsModule, MdSelectModule ],
      declarations: [ CbiSelectComponent ]
    });

    fixture = TestBed.createComponent(CbiSelectComponent);
    componentInstance = fixture.componentInstance;

    componentInstance.model = inputModels.options[0].value;
    componentInstance.options = inputModels.options;
    componentInstance.displayKey = inputModels.displayKey;
    componentInstance.valueKey = inputModels.valueKey;
    componentInstance.subDisplayKey = inputModels.subDisplayKey;
    componentInstance.title = inputModels.title;
  });

  describe('component title', () => {
    it('should contain a title element when [title] input is passed in', () => {
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('.title'));

      expect(titleElement).not.toBe(null);
      expect(titleElement.nativeElement.textContent).toBe(inputModels.title);
    });

    it('should not contain a title element when [title] input is not passed in', () => {
      componentInstance.title = undefined;
      fixture.detectChanges();
      const titleElement = fixture.debugElement.query(By.css('.title'));

      expect(titleElement).toBe(null);
    });
  });

  describe('component sub-title', () => {
    it('should contain a sub-title element when [subDisplayKey] input is passed in', () => {
      fixture.detectChanges();
      const subTitleElement = fixture.debugElement.query(By.css('.sub-title'));

      expect(subTitleElement).not.toBe(null);
      expect(subTitleElement.nativeElement.textContent).toBe(inputModels.options[0][inputModels.subDisplayKey]);
    });

    it('should not contain a sub-title element when [subDisplayKey] input is not passed in', () => {
      componentInstance.subDisplayKey = undefined;
      fixture.detectChanges();
      const subTitleElement = fixture.debugElement.query(By.css('.sub-title'));

      expect(subTitleElement).toBe(null);
    });
  });
});
