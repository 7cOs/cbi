import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AccountsApiService } from '../../services/api/v3/accounts-api.service';
import { BeerLoaderComponent } from '../../shared/components/beer-loader/beer-loader.component';
import { DistributorsApiService } from '../../services/api/v3/distributors-api.service';
import { MyPerformanceBreadcrumbComponent } from '../../shared/components/my-performance-breadcrumb/my-performance-breadcrumb.component';
import { MyPerformanceComponent } from './my-performance.component';
import { MyPerformanceFilterComponent } from '../../shared/components/my-performance-filter/my-performance-filter.component';
import { MyPerformanceTableComponent } from '../../shared/components/my-performance-table/my-performance-table.component';
import { MyPerformanceTableRowComponent } from '../../shared/components/my-performance-table-row/my-performance-table-row.component';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceService } from '../../services/my-performance.service';
import { ProductMetricsService } from '../../services/product-metrics.service';
import { PerformanceTransformerService } from '../../services/performance-transformer.service';
import { PositionsApiService } from '../../services/api/v3/positions-api.service';
import { ProductMetricsTransformerService } from  '../../services/product-metrics-transformer.service';
import { ResponsibilitiesTransformerService } from  '../../services/responsibilities-transformer.service';
import { ResponsibilitiesService } from  '../../services/responsibilities.service';
import { SharedModule } from '../../shared/shared.module';
import { SortIndicatorComponent } from '../../shared/components/sort-indicator/sort-indicator.component';
import { SubAccountsApiService } from '../../services/api/v3/sub-accounts-api.service';
import { TeamPerformanceOpportunitiesComponent }
  from '../../shared/components/team-performance-opportunities/team-performance-opportunities.component';
import { V3ApiHelperService } from '../../services/api/v3/v3-api-helper.service';
import { WindowService } from '../../services/window.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    BeerLoaderComponent,
    MyPerformanceBreadcrumbComponent,
    MyPerformanceComponent,
    MyPerformanceFilterComponent,
    MyPerformanceTableComponent,
    MyPerformanceTableRowComponent,
    SortIndicatorComponent,
    TeamPerformanceOpportunitiesComponent
  ],
  providers: [
    AccountsApiService,
    DistributorsApiService,
    MyPerformanceTableDataTransformerService,
    MyPerformanceService,
    PerformanceTransformerService,
    PositionsApiService,
    ProductMetricsService,
    ProductMetricsTransformerService,
    ResponsibilitiesService,
    ResponsibilitiesTransformerService,
    SubAccountsApiService,
    Title,
    V3ApiHelperService,
    WindowService
  ]
})

export class MyPerformanceModule {}
