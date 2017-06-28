import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { MyPerformanceComponent }    from './my-performance.component';
import { MyPerformanceTableComponent } from '../../shared/components/my-performance-table/my-performance-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    MyPerformanceComponent,
    MyPerformanceTableComponent
  ]
})

export class MyPerformanceModule {}
