import { NgModule } from '@angular/core';
import { BeerLoaderComponent } from './components/beer-loader/beer-loader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatRadioModule, MatRippleModule, MatSelectModule,
        MatSidenavModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';

import { CompassActionButtonComponent } from './components/compass-action-button/compass-action-button.component';
import { CompassCardComponent }  from './components/compass-card/compass-card.component';
import { CompassAlertModalComponent } from './components/compass-alert-modal/compass-alert-modal.component';
import { CompassModalService } from '../services/compass-modal.service';
import { CompassOverlayService } from '../services/compass-overlay.service';
import { CompassRadioComponent } from './components/compass-radio/compass-radio.component';
import { CompassSelectComponent } from './components/compass-select/compass-select.component';
import { CompassTabsComponent } from './components/compass-tabs/compass-tabs.component';
import { CompassTooltipComponent } from './components/compass-tooltip/compass-tooltip.component';
import { CompassTooltipPopupComponent } from './components/compass-tooltip-popup/compass-tooltip-popup.component';
import { CompassTooltipService } from '../services/compass-tooltip.service';
import { DismissibleXComponent } from './components/dismissible-x/dismissible-x.component';
import { SortIndicatorComponent } from './components/sort-indicator/sort-indicator.component';
import { CompassTabComponent } from './components/compass-tabs/tab/tab.component';

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
    BeerLoaderComponent,
    CompassAlertModalComponent,
    CompassRadioComponent,
    CompassSelectComponent,
    CompassTabsComponent,
    CompassTooltipComponent,
    CompassTooltipPopupComponent,
    DismissibleXComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatRippleModule,
    MatSidenavModule,
    OverlayModule,
    SortIndicatorComponent,
    CompassTabComponent
  ],
  declarations: [
    BeerLoaderComponent,
    CompassActionButtonComponent,
    CompassCardComponent,
    CompassAlertModalComponent,
    CompassRadioComponent,
    CompassSelectComponent,
    CompassTabsComponent,
    CompassTooltipComponent,
    CompassTooltipPopupComponent,
    DismissibleXComponent,
    SortIndicatorComponent,
    CompassTabComponent
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
