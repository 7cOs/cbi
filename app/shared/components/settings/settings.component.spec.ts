import { SettingsComponent } from './settings.component';
import { inject, TestBed } from '@angular/core/testing';
import * as Chance from 'chance';
import { StoreModule } from '@ngrx/store';
import { rootReducer } from '../../../state/reducers/root.reducer';
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
    imports: [
      StoreModule.provideStore(rootReducer),
    ],
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
