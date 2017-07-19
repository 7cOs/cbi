import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { MyPerformanceComponent }    from './my-performance.component';
import { MyPerformanceTableComponent } from '../../shared/components/my-performance-table/my-performance-table.component';
import { MyPerformanceTableRowComponent } from '../../shared/components/my-performance-table-row/my-performance-table-row.component';
import { SharedModule } from '../../shared/shared.module';
import { SortableComponent } from '../../shared/components/sortable/sortable.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    MyPerformanceComponent,
    MyPerformanceTableComponent,
    MyPerformanceTableRowComponent,
    SortableComponent
  ]
})

export class MyPerformanceModule {}
