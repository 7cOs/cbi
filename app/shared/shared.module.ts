import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule } from '@angular/material';

import { CompassCardComponent }  from './components/compass-card/compass-card.component';
import { CompassRadioComponent } from './components/compass-radio/compass-radio.component';
import { CompassSelectComponent } from './components/compass-select/compass-select.component';
import { CompassTooltipComponent } from './components/compass-tooltip/compass-tooltip.component';
import { DismissableXComponent } from './components/dismissable-x/dismissable-x.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule
  ],
  exports: [
    CompassRadioComponent,
    CompassSelectComponent,
    CompassTooltipComponent,
    DismissableXComponent,
    MatRippleModule,
    MatSidenavModule
  ],
  declarations: [
    CompassCardComponent,
    CompassRadioComponent,
    CompassSelectComponent,
    CompassTooltipComponent,
    DismissableXComponent
  ]
})

export class SharedModule {}
