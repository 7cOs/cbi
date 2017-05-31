import { TestBed, inject } from '@angular/core/testing';
import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { appVersionMock } from '../../models/app-version.model.mock';
import { CompassVersionEffects } from './compass-version.effect';
import { FetchVersionAction, FetchVersionFailureAction, FetchVersionSuccessAction } from '../actions/compass-version.action';
import * as Chance from 'chance';
let chance = new Chance();

describe('Compass Version Effects', () => {

  let runner: EffectsRunner;
  let compassVersionEffects: CompassVersionEffects;
  const mockVersion = appVersionMock();

  const testBedInit = (providers: Array<any> = []) => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [ CompassVersionEffects ].concat(providers)
    }));

    beforeEach(inject([ EffectsRunner, CompassVersionEffects ],
      (_runner: EffectsRunner, _compassWebEffects: CompassVersionEffects) => {
        runner = _runner;
        compassVersionEffects = _compassWebEffects;
      }
    ));
  };

  describe('when a FetchVersionAction is received', () => {

    describe('when versionService returns successfully', () => {

      testBedInit([{
        provide: 'versionService',
        useValue: {
          getVersion: () => Promise.resolve(mockVersion),
          model: { }
        }
      }]);

      it('should return a FetchVersionSuccessAction after receiving version', (done) => {
        runner.queue(new FetchVersionAction());

        compassVersionEffects.fetchVersion$().subscribe(result => {
          expect(result).toEqual(new FetchVersionSuccessAction(mockVersion));
          done();
        });
      });
    });

    describe('when versionService returns an error', () => {

      const error = new Error(chance.string());

      testBedInit([{
        provide: 'versionService',
        useValue: {
          getVersion: () => Promise.reject(error),
          model: { }
        }
      }]);

      it('should return a FetchVersionFailureAction after catching an error', (done) => {
        runner.queue(new FetchVersionAction());

        compassVersionEffects.fetchVersion$().subscribe(result => {
          expect(result).toEqual(new FetchVersionFailureAction(error));
          done();
        });
      });
    });
  });
});
