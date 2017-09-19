import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyPerformanceBreadcrumbComponent } from '../../shared/components/my-performance-breadcrumb/my-performance-breadcrumb.component';
import { MyPerformanceComponent } from './my-performance.component';
import { MyPerformanceFilterComponent } from '../../shared/components/my-performance-filter/my-performance-filter.component';
import { MyPerformanceTableComponent } from '../../shared/components/my-performance-table/my-performance-table.component';
import { MyPerformanceTableRowComponent } from '../../shared/components/my-performance-table-row/my-performance-table-row.component';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { PerformanceTransformerService } from '../../services/performance-transformer.service';
import { ProductMetricsTransformerService } from  '../../services/product-metrics-transformer.service';
import { ResponsibilitiesTransformerService } from  '../../services/responsibilities-transformer.service';
import { ResponsibilitiesService } from  '../../services/responsibilities.service';
import { SharedModule } from '../../shared/shared.module';
import { SortIndicatorComponent } from '../../shared/components/sort-indicator/sort-indicator.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    MyPerformanceBreadcrumbComponent,
    MyPerformanceComponent,
    MyPerformanceFilterComponent,
    MyPerformanceTableComponent,
    MyPerformanceTableRowComponent,
    SortIndicatorComponent
  ],
  providers: [
    MyPerformanceApiService,
    MyPerformanceTableDataTransformerService,
    PerformanceTransformerService,
    ProductMetricsTransformerService,
    ResponsibilitiesTransformerService,
    ResponsibilitiesService
  ]
})

export class MyPerformanceModule {}
