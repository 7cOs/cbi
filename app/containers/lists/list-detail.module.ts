import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDetailComponent } from '../../containers/lists/list-detail.component';
import { ListPerformanceTableComponent } from '../../shared/components/list-performance-table/list-performance-table.component';
import { ListPerformanceTableRowComponent } from '../../shared/components/list-performance-table-row/list-performance-table-row.component';
import { SharedModule } from '../../shared/shared.module';
import { MatCheckboxModule } from '@angular/material';

@NgModule({
  imports: [SharedModule, CommonModule, MatCheckboxModule],
  declarations: [
    ListDetailComponent,
    ListPerformanceTableComponent,
    ListPerformanceTableRowComponent
  ]
})

export class ListDetailModule {}
