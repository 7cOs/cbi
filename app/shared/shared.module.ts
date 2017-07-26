import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdSelectModule } from '@angular/material';

import { CompassCardComponent }  from './components/compass-card/compass-card.component';
import { CompassSelectComponent } from './components/compass-select/compass-select.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MdSelectModule
  ],
  exports: [
    CompassSelectComponent
  ],
  declarations: [
    CompassCardComponent,
    CompassSelectComponent
  ]
})

export class SharedModule {}
