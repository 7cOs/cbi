import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdRadioModule, MdSelectModule } from '@angular/material';

import { CompassCardComponent }  from './components/compass-card/compass-card.component';
import { CompassRadioComponent } from './components/compass-radio/compass-radio.component';
import { CompassSelectComponent } from './components/compass-select/compass-select.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MdRadioModule,
    MdSelectModule
  ],
  exports: [
    CompassRadioComponent,
    CompassSelectComponent
  ],
  declarations: [
    CompassCardComponent,
    CompassRadioComponent,
    CompassSelectComponent
  ]
})

export class SharedModule {}