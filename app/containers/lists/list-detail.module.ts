import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDetailComponent } from '../../containers/lists/list-detail.component';
import { ListPerformanceTableComponent } from '../../shared/components/list-performance-table/list-performance-table.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule, CommonModule],
  declarations: [
    ListDetailComponent,
    ListPerformanceTableComponent
  ]
})

export class ListDetailModule {}
