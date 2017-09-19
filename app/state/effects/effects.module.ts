import { NgModule } from '@angular/core';
import { EffectsModule as Effects } from '@ngrx/effects';

import { CompassVersionEffects } from './compass-version.effect';
import { DateRangesEffects } from './date-ranges.effect';
import { ResponsibilitiesEffects } from './responsibilities.effect';
import { ProductMetricsEffects } from './product-metrics.effect';

@NgModule({
  imports: [
    Effects.run(CompassVersionEffects),
    Effects.run(DateRangesEffects),
    Effects.run(ProductMetricsEffects),
    Effects.run(ResponsibilitiesEffects)
  ]
})
export class EffectsModule { }
