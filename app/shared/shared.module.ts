import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdSelectModule } from '@angular/material';

import { CbiSelectComponent } from './components/cbi-select/cbi-select.component';

@NgModule({
  imports: [
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
