import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';

import { CompassActionButtonComponent } from './components/compass-action-button/compass-action-button.component';
import { CompassCardComponent }  from './components/compass-card/compass-card.component';
import { CompassAlertModalComponent } from './components/compass-alert-modal/compass-alert-modal.component';
import { CompassModalService } from '../services/compass-modal.service';
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
    CompassActionButtonComponent,
    CompassAlertModalComponent,
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
    CompassActionButtonComponent,
    CompassCardComponent,
    CompassAlertModalComponent,
    CompassRadioComponent,
    CompassSelectComponent,
    CompassTooltipComponent,
    CompassTooltipPopupComponent,
    DismissibleXComponent
  ],
  providers: [
    CompassModalService,
    CompassOverlayService,
    CompassTooltipService
  ],
  entryComponents: [
    CompassAlertModalComponent,
    CompassTooltipPopupComponent
  ]
})

export class SharedModule {}
