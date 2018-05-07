import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListDetailComponent } from '../../containers/lists/list-detail.component';
import { ListsHeaderComponent } from '../../shared/components/lists-header/lists-header.component';
import { ListOpportunitiesTableComponent } from '../../shared/components/list-opportunities-table/list-opportunities-table.component';
import { ListOpportunitiesTableRowComponent }
        from '../../shared/components/list-opportunities-table-row/list-opportunities-table-row.component';
import { ListPerformanceTableComponent } from '../../shared/components/list-performance-table/list-performance-table.component';
import { ListPerformanceTableRowComponent } from '../../shared/components/list-performance-table-row/list-performance-table-row.component';
import { ListsTableTransformerService } from '../../services/transformers/lists-table-transformer.service';
import { ListsTransformerService } from '../../services/lists-transformer.service';
import { SharedModule } from '../../shared/shared.module';
import { ListsPaginationComponent } from '../../shared/components/lists-pagination/lists-pagination.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    ListDetailComponent,
    ListsHeaderComponent,
    ListOpportunitiesTableComponent,
    ListOpportunitiesTableRowComponent,
    ListsPaginationComponent,
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
