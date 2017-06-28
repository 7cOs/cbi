import { NgModule } from '@angular/core';
import { EffectsModule as Effects } from '@ngrx/effects';
import { CompassVersionEffects } from './compass-version.effect';
import { DateRangesEffects } from './date-ranges.effect';

@NgModule({
  imports: [
    Effects.run(CompassVersionEffects),
    Effects.run(DateRangesEffects)
  ]
})
export class EffectsModule { }
