import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdRadioModule, MdSelectModule } from '@angular/material';

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
    CompassRadioComponent,
    CompassSelectComponent
  ]
})

export class SharedModule {}
