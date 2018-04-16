import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListDetailComponent } from '../../containers/lists/list-detail.component';
import { ListPerformanceTableComponent } from '../../shared/components/list-performance-table/list-performance-table.component';
import { ListsTransformerService } from '../../services/lists-transformer.service';
import { ListPerformanceTableRowComponent } from '../../shared/components/list-performance-table-row/list-performance-table-row.component';
import { MatCheckboxModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    SharedModule
  ],
  declarations: [
    ListDetailComponent,
    ListPerformanceTableComponent,
    ListPerformanceTableRowComponent
  ],
  providers: [
    ListsApiService,
    ListsTransformerService
  ]
})

export class ListDetailModule {}
