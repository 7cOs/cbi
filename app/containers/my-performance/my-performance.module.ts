import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { MyPerformanceComponent }    from './my-performance.component';
import { MyPerformanceTableComponent } from '../../shared/components/my-performance-table/my-performance-table.component';
import { MyPerformanceTableRowComponent } from '../../shared/components/my-performance-table-row/my-performance-table-row.component';
import { SortableComponent } from '../../shared/components/sortable/sortable.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    MyPerformanceComponent,
    MyPerformanceTableComponent,
    MyPerformanceTableRowComponent,
    SortableComponent
  ]
})

export class MyPerformanceModule {}
