import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { MyPerformanceComponent } from './my-performance.component';
import { MyPerformanceFilterComponent } from '../../shared/components/my-performance-filter/my-performance-filter.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    MyPerformanceComponent,
    MyPerformanceFilterComponent
  ]
})

export class MyPerformanceModule {}
