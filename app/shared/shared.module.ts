import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdSelectModule } from '@angular/material';

import { CbiSelectComponent } from './components/cbi-select/cbi-select.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MdSelectModule
  ],
  exports: [
    CbiSelectComponent
  ],
  declarations: [
    CbiSelectComponent
  ]
})

export class SharedModule {}
