import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ListDetailComponent } from '../../containers/lists/list-detail.component';
import { ListsHeaderComponent } from '../../shared/components/lists-header/lists-header.component';
import { ListPerformanceTableComponent } from '../../shared/components/list-performance-table/list-performance-table.component';
import { ListPerformanceTableRowComponent } from '../../shared/components/list-performance-table-row/list-performance-table-row.component';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListsTableTransformerService } from '../../services/transformers/lists-table-transformer.service';
import { ListsTransformerService } from '../../services/lists-transformer.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    ListDetailComponent,
    ListsHeaderComponent,
    ListPerformanceTableComponent,
    ListPerformanceTableRowComponent
  ],
  providers: [
    ListsApiService,
    ListsTableTransformerService,
    ListsTransformerService
  ]
})

export class ListDetailModule {}
