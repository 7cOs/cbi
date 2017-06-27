import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbiSelectComponent } from './cbi-select.component';
import { FormsModule } from '@angular/forms';
import { MdSelectModule } from '@angular/material';

// import * as Chance from 'chance';
// const chance = new Chance();

describe('CbiSelectComponent', () => {

  let fixture: ComponentFixture<CbiSelectComponent>;
  let componentInstance: CbiSelectComponent;
  let selectedValueTextElement: HTMLElement;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule, FormsModule, MdSelectModule ],
      declarations: [ CbiSelectComponent ]
    });

    fixture = TestBed.createComponent(CbiSelectComponent);
    componentInstance = fixture.componentInstance;
    selectedValueTextElement = fixture.debugElement.query(By.css('.title')).nativeElement;
  });

  it('should contain a title if passed in', () => {
    componentInstance.options = [{ name: 'Peter', value: 'PIOTR' }];
    componentInstance.displayKey = 'name';
    componentInstance.valueKey = 'value';
    componentInstance.model = 'PIOTR';
    componentInstance.title = 'TITLE!';
    fixture.detectChanges();
    expect(selectedValueTextElement.textContent).toBe('TITLE!');
  });
});
