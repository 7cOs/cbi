import { NgModule } from '@angular/core';
import { EffectsModule as Effects } from '@ngrx/effects';

import { CompassVersionEffects } from './compass-version.effect';
import { DateRangesEffects } from './date-ranges.effect';
import { PerformanceTotalEffects } from './performance-total.effect';
import { ResponsibilitiesEffects } from './responsibilities.effect';

@NgModule({
  imports: [
    Effects.run(CompassVersionEffects),
    Effects.run(DateRangesEffects),
    Effects.run(PerformanceTotalEffects),
    Effects.run(ResponsibilitiesEffects)
  ]
})
export class EffectsModule { }
