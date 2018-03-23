import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';

import { CompassCardComponent }  from './components/compass-card/compass-card.component';
import { CompassOverlayService } from '../services/compass-overlay.service';
import { CompassRadioComponent } from './components/compass-radio/compass-radio.component';
import { CompassSelectComponent } from './components/compass-select/compass-select.component';
import { CompassTooltipComponent } from './components/compass-tooltip/compass-tooltip.component';
import { CompassTooltipPopupComponent } from './components/compass-tooltip-popup/compass-tooltip-popup.component';
import { CompassTooltipService } from '../services/compass-tooltip.service';
import { DismissibleXComponent } from './components/dismissible-x/dismissible-x.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
    OverlayModule
  ],
  exports: [
    CompassRadioComponent,
    CompassSelectComponent,
    CompassTooltipComponent,
    CompassTooltipPopupComponent,
    DismissibleXComponent,
    MatRippleModule,
    MatSidenavModule,
    OverlayModule
  ],
  declarations: [
    CompassCardComponent,
    CompassRadioComponent,
    CompassSelectComponent,
    CompassTooltipComponent,
    CompassTooltipPopupComponent,
    DismissibleXComponent
  ],
  providers: [
    CompassOverlayService,
    CompassTooltipService
  ],
  entryComponents: [
    CompassTooltipPopupComponent
  ]
})

export class SharedModule {}
