import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { ProductMetrics } from '../models/product-metrics.model';
import { ProductMetricsApiService } from '../services/product-metrics-api.service';
import { ProductMetricsData } from '../services/product-metrics.service';
import { ProductMetricsTransformerService } from '../services/product-metrics-transformer.service';
import { ProductMetricsDTO } from '../models/product-metrics.model';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';
import { SelectedEntityType } from '../enums/selected-entity-type.enum';

export interface ProductMetricsData {
  positionId: string;
  contextPositionId?: string;
  entityTypeCode?: string;
  filter: MyPerformanceFilterState;
  selectedEntityType: SelectedEntityType;
  products?: ProductMetrics;
}

@Injectable()
export class ProductMetricsService {

  constructor(
    private productMetricsApiService: ProductMetricsApiService,
    private productMetricsTransformerService: ProductMetricsTransformerService,
    @Inject('toastService') private toastService: any
  ) { }

  public getProductMetrics(productMetricsData: ProductMetricsData): Observable<ProductMetricsData> {
    let dtos: Observable<ProductMetricsDTO | Error>;
    if (productMetricsData.selectedEntityType === SelectedEntityType.Position) {
      dtos = this.productMetricsApiService.getPositionProductMetrics(
        productMetricsData.positionId, productMetricsData.filter, ProductMetricsAggregationType.brand
      );
    } else if (productMetricsData.selectedEntityType === SelectedEntityType.Account) {
      dtos = this.productMetricsApiService.getAccountProductMetrics(
        productMetricsData.positionId, productMetricsData.contextPositionId, productMetricsData.filter, ProductMetricsAggregationType.brand
      );
    } else if (productMetricsData.selectedEntityType === SelectedEntityType.RoleGroup) {
      dtos = this.productMetricsApiService.getRoleGroupProductMetrics(
        productMetricsData.positionId, productMetricsData.entityTypeCode, productMetricsData.filter, ProductMetricsAggregationType.brand
      );
    }

    return dtos.map((productMetricsDTO: ProductMetricsDTO) => {
      return Object.assign({}, productMetricsData, {
        products: this.productMetricsTransformerService.transformProductMetrics(productMetricsDTO)
      });
    })
    .catch(() => {
      this.toastService.showPerformanceDataErrorToast();
      return Observable.of(productMetricsData);
    });
  }
}
