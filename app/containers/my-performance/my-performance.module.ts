import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { MyPerformanceComponent }    from './my-performance.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    MyPerformanceComponent
  ]
})

export class MyPerformanceModule {}
