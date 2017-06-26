import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { MyPerformanceComponent }    from './my-performance.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    MyPerformanceComponent
  ]
})

export class MyPerformanceModule {}
