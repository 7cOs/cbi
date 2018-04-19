import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListDetailComponent } from '../../containers/lists/list-detail.component';
import { ListsHeaderComponent } from '../../shared/components/lists-header/lists-header.component';
import { ListOpportunitiesTableComponent } from '../../shared/components/list-opportunities-table/list-opportunities-table.component';
import { ListOpportunitiesTableRowComponent }
        from '../../shared/components/list-opportunities-table-row/list-opportunities-table-row.component';
import { ListPerformanceTableComponent } from '../../shared/components/list-performance-table/list-performance-table.component';
import { ListPerformanceTableRowComponent } from '../../shared/components/list-performance-table-row/list-performance-table-row.component';
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
    ListOpportunitiesTableComponent,
    ListOpportunitiesTableRowComponent,
    ListPerformanceTableComponent,
    ListPerformanceTableRowComponent
  ],
  providers: [
    ListsApiService,
    ListsTransformerService
  ]
})

export class ListDetailModule {}
