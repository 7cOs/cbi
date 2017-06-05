import { SettingsComponent } from './settings.component';
import { inject, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import * as Chance from 'chance';
let chance = new Chance();

describe('SettingsComponent', () => {
  const mockUserService = {
    model: {
      currentUser: {
        firstName: chance.string(),
        lastName: chance.string()
      }
    }
  };

  // normally we could just make the select spy return Observable.of({}), but in this case
  // we're testing multiple behaviors on the resulting observable, so we need more complex mocks
  const mockRefCount$ = chance.string();
  const mockPublishReplay$ = {
    refCount: jasmine.createSpy('refCount').and.returnValue(mockRefCount$)
  };
  const mockSelect$ = {
    publishReplay: jasmine.createSpy('publishReplay').and.returnValue(mockPublishReplay$)
  };
  const mockStore = {
    select: jasmine.createSpy('select').and.returnValue(mockSelect$)
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SettingsComponent,
      {
        provide: 'userService',
        useValue: mockUserService
      },
      {
        provide: Store,
        useValue: mockStore
      },
    ]
  }));

  describe('ngOnInit', () => {
    beforeEach(inject([ SettingsComponent ], (component: SettingsComponent) => {
      component.ngOnInit();
    }));

    it('should get firstName and lastName from userService', inject([ SettingsComponent ], (component: SettingsComponent) => {
      expect(component.firstName).toBe(mockUserService.model.currentUser.firstName);
      expect(component.lastName).toBe(mockUserService.model.currentUser.lastName);
    }));

    it('should share version Observable by making it hot and replaying the last value',
      inject([ SettingsComponent ], (component: SettingsComponent) => {
      // ensure accurate select function is used
      const selectFunction = mockStore.select.calls.first().args[0];
      const mockState = {
        compassVersion: {
          version: chance.string()
        }
      };
      expect(selectFunction(mockState)).toBe(mockState.compassVersion.version);

      // ensure observable is properly set to hot
      expect(mockSelect$.publishReplay).toHaveBeenCalledWith(1);
      expect(mockPublishReplay$.refCount).toHaveBeenCalled();
      expect(component.version$ as any).toBe(mockRefCount$);
    }));
  });
});
