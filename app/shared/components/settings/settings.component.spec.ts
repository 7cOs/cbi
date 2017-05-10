import { SettingsComponent } from './settings.component';
import { inject, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
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

  let mockVersionService = {
    data: {
      version: chance.string(),
      hash: chance.string()
    },

    getVersion: function() {
      return Promise.resolve(this.data);
    }
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SettingsComponent,
      {
        provide: 'userService',
        useValue: mockUserService
      },
      {
        provide: 'versionService',
        useValue: mockVersionService
      }
    ]
  }));

  it('should get firstName and lastName from userService on init', inject([ SettingsComponent ], (component: SettingsComponent) => {
    component.ngOnInit();
    expect(component.firstName).toBe(mockUserService.model.currentUser.firstName);
    expect(component.lastName).toBe(mockUserService.model.currentUser.lastName);
  }));

  it('should get version hash and number from on init', inject([ SettingsComponent ], fakeAsync((component: SettingsComponent) => {
    component.ngOnInit();
    flushMicrotasks();
    expect(component.versionNumber).toBe(mockVersionService.data.version);
    expect(component.versionHash).toBe(mockVersionService.data.hash);
  })));

});
