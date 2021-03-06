import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GreetingComponent } from './greeting.component';
import * as moment from 'moment';
import * as Chance from 'chance';

const chance = new Chance();

describe('GreetingComponent', () => {

  let fixture: ComponentFixture<GreetingComponent>;
  let componentInstance: GreetingComponent;
  let greetingHeaderElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ GreetingComponent ]
    });

    fixture = TestBed.createComponent(GreetingComponent);
    componentInstance = fixture.componentInstance;
    greetingHeaderElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    componentInstance.name = 'TIM';
  });

  it('should salutate the user with "Good morning" during morning hours', () => {
    const randomMorningHour = chance.integer({min: 0, max: 11});
    jasmine.clock().mockDate(moment().hour(randomMorningHour).toDate());
    fixture.detectChanges();
    expect(greetingHeaderElement.textContent).toBe('Good morning, Tim!');
  });

  it('should NOT salutate the user with "Good morning" during non-morning hours', () => {
    const randomNonMorningHour = chance.integer({min: 12, max: 23});
    jasmine.clock().mockDate(moment().hour(randomNonMorningHour).toDate());
    fixture.detectChanges();
    expect(greetingHeaderElement.textContent).not.toBe('Good morning, Tim!');
  });

  it('should salutate the user with "Good afternoon" during afternoon hours', () => {
    const randomAfternoonHour = chance.integer({min: 12, max: 16});
    jasmine.clock().mockDate(moment().hour(randomAfternoonHour).toDate());
    fixture.detectChanges();
    expect(greetingHeaderElement.textContent).toBe('Good afternoon, Tim!');
  });

  it('should NOT salutate the user with "Good afternoon" during non-afternoon hours', () => {
    const randomNonAfternoonHour = Math.random() > 0.5
      ? chance.integer({min: 0, max: 11})
      : chance.integer({min: 17, max: 23});

    jasmine.clock().mockDate(moment().hour(randomNonAfternoonHour).toDate());
    fixture.detectChanges();
    expect(greetingHeaderElement.textContent).not.toBe('Good afternoon, Tim!');
  });

  it('should salutate the user with "Good evening" during evening hours', () => {
    const randomEveningHour = chance.integer({min: 17, max: 23});
    jasmine.clock().mockDate(moment().hour(randomEveningHour).toDate());
    fixture.detectChanges();
    expect(greetingHeaderElement.textContent).toBe('Good evening, Tim!');
  });

  it('should NOT salutate the user with "Good evening" during non-evening hours', () => {
    const randomNonEveningHour = chance.integer({min: 0, max: 16});
    jasmine.clock().mockDate(moment().hour(randomNonEveningHour).toDate());
    fixture.detectChanges();
    expect(greetingHeaderElement.textContent).not.toBe('Good evening, Tim!');
  });
});
