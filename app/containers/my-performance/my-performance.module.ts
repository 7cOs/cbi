import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { MyPerformanceComponent } from './my-performance.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    MyPerformanceComponent,
    MyPerformanceTableComponent,
    MyPerformanceTableLeftComponent,
    MyPerformanceTableRightComponent,
    MyPerformanceTableRowComponent,
    SortableComponent
  ]
})

export class MyPerformanceModule {}
