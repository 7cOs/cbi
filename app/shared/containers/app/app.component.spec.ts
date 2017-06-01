import { AppComponent } from './app.component';
import { FetchVersionAction } from '../../../state/actions/compass-version.action';
import { inject, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

describe('AppComponent', () => {

  const mockStore = {
    dispatch: jasmine.createSpy('dispatch')
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AppComponent,
      {
        provide: Store,
        useValue: mockStore
      },
    ]
  }));

  describe('ngOnInit', () => {
    beforeEach(inject([ AppComponent ], (component: AppComponent) => {
      component.ngOnInit();
    }));

    it('should dispatch actions', () => {
      expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.any(FetchVersionAction));
    });
  });
});
