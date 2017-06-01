import { NgModule } from '@angular/core';
import { EffectsModule as Effects } from '@ngrx/effects';
import { CompassVersionEffects } from './compass-version.effect';

@NgModule({
  imports: [
    Effects.run(CompassVersionEffects)
  ]
})
export class EffectsModule {
}
