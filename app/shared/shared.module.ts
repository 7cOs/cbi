import { NgModule } from '@angular/core';
import { BeerLoaderComponent } from './components/beer-loader/beer-loader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatMenuModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule
} from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';

import { CompassActionButtonComponent } from './components/compass-action-button/compass-action-button.component';
import { CompassCardComponent }  from './components/compass-card/compass-card.component';
import { CompassAlertModalComponent } from './components/compass-alert-modal/compass-alert-modal.component';
import { CompassManageListModalComponent } from './components/compass-manage-list-modal/compass-manage-list-modal.component';
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
import { ReactiveFormsModule } from '@angular/forms';
import { CompassListClassUtilService } from '../services/compass-list-class-util.service';
import { CompassUserSearchComponent } from './components/compass-user-search/compass-user-search.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule,
    OverlayModule
  ],
  exports: [
    CompassActionButtonComponent,
    BeerLoaderComponent,
    CompassAlertModalComponent,
    CompassManageListModalComponent,
    CompassRadioComponent,
    CompassSelectComponent,
    CompassTabsComponent,
    CompassTooltipComponent,
    CompassTooltipPopupComponent,
    DismissibleXComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatRippleModule,
    MatSidenavModule,
    MatAutocompleteModule,
    OverlayModule,
    SortIndicatorComponent,
    CompassTabComponent,
    CompassUserSearchComponent
  ],
  declarations: [
    BeerLoaderComponent,
    CompassActionButtonComponent,
    CompassCardComponent,
    CompassAlertModalComponent,
    CompassManageListModalComponent,
    CompassRadioComponent,
    CompassSelectComponent,
    CompassTabsComponent,
    CompassTooltipComponent,
    CompassTooltipPopupComponent,
    DismissibleXComponent,
    SortIndicatorComponent,
    CompassTabComponent,
    CompassUserSearchComponent
  ],
  providers: [
    CompassModalService,
    CompassOverlayService,
    CompassTooltipService,
    CompassListClassUtilService
  ],
  entryComponents: [
    CompassAlertModalComponent,
    CompassManageListModalComponent,
    CompassTooltipPopupComponent
  ]
})

export class SharedModule {}
