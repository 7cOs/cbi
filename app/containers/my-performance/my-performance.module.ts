import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { MyPerformanceComponent }    from './my-performance.component';
import { MyPerformanceTableComponent } from '../../shared/components/my-performance-table/my-performance-table.component';
import { MyPerformanceTableRowComponent } from '../../shared/components/my-performance-table-row/my-performance-table-row.component';
import { SharedModule } from '../../shared/shared.module';
import { SortIndicatorComponent } from '../../shared/components/sort-indicator/sort-indicator.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    MyPerformanceComponent,
    MyPerformanceTableComponent,
    MyPerformanceTableRowComponent,
    SortIndicatorComponent
  ]
})

export class MyPerformanceModule {}
