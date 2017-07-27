import { TestBed, inject } from '@angular/core/testing';
import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { getAppVersionMock } from '../../models/app-version.model.mock';
import { CompassVersionEffects } from './compass-version.effect';
import { FetchVersionAction, FetchVersionFailureAction, FetchVersionSuccessAction } from '../actions/compass-version.action';
import * as Chance from 'chance';
let chance = new Chance();

describe('Compass Version Effects', () => {

  let runner: EffectsRunner;
  let compassVersionEffects: CompassVersionEffects;
  const mockVersion = getAppVersionMock();
  let mockVersionService = {
    getVersion: () => Promise.resolve(mockVersion),
    model: { } as any
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      CompassVersionEffects,
      {
        provide: 'versionService',
        useValue: mockVersionService
      }
    ]
  }));

  beforeEach(inject([ EffectsRunner, CompassVersionEffects ],
    (_runner: EffectsRunner, _compassWebEffects: CompassVersionEffects) => {
      runner = _runner;
      compassVersionEffects = _compassWebEffects;
    }
  ));

  describe('when a FetchVersionAction is received', () => {

    describe('when versionService returns successfully', () => {

      let versionService: any;

      beforeEach(inject([ 'versionService' ],
        (_versionService: any) => {
          versionService = _versionService;

          runner.queue(new FetchVersionAction());
        }
      ));

      it('should return a FetchVersionSuccessAction and set version results on model', (done) => {
        compassVersionEffects.fetchVersion$().subscribe(result => {
          expect(versionService.model.version).toEqual(mockVersion);
          expect(result).toEqual(new FetchVersionSuccessAction(mockVersion));
          done();
        });
      });
    });

    describe('when versionService returns an error', () => {

      const error = new Error(chance.string());

      beforeEach(inject([ 'versionService' ],
        (versionService: any) => {
          versionService.getVersion = () => Promise.reject(error);

          runner.queue(new FetchVersionAction());
        }
      ));

      it('should return a FetchVersionFailureAction after catching an error', (done) => {
        compassVersionEffects.fetchVersion$().subscribe(result => {
          expect(result).toEqual(new FetchVersionFailureAction(error));
          done();
        });
      });
    });
  });

  describe('when a FetchVersionFailureAction is received', () => {

    const err = new Error(chance.string());

    beforeEach(() => {
      runner.queue(new FetchVersionFailureAction(err));
      spyOn(console, 'error');
    });

    // console logging isn't important, but it will be important to test real error handling if added later
    it('should log the error payload', (done) => {
      compassVersionEffects.fetchVersionFailure$().subscribe(() => {
        expect(console.error).toHaveBeenCalled();
        done();
      });
    });
  });
});
