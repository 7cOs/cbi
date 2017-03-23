import { SettingsComponent } from './settings.component';
import { inject, TestBed } from '@angular/core/testing';
import * as Chance from 'chance';
let chance = new Chance();

describe('SettingsComponent', () => {
  let mockUserService = {
    model: {
      currentUser: {
        firstName: chance.string(),
        lastName: chance.string()
      }
    }
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SettingsComponent,
      {
        provide: 'userService',
        useValue: mockUserService
      }
    ]
  }));

  it('should get firstName and lastName from userService on init', inject([ SettingsComponent ], (component: SettingsComponent) => {
    component.ngOnInit();
    expect(component.firstName).toBe(mockUserService.model.currentUser.firstName);
    expect(component.lastName).toBe(mockUserService.model.currentUser.lastName);
  }));
});
