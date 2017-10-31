import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { EntityType } from '../enums/entity-responsibilities.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { ProductMetrics } from '../models/product-metrics.model';
import { ProductMetricsApiService } from '../services/product-metrics-api.service';
import { ProductMetricsData } from '../services/product-metrics.service';
import { ProductMetricsTransformerService } from '../services/product-metrics-transformer.service';
import { ProductMetricsDTO, ProductMetricsValues } from '../models/product-metrics.model';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsViewType } from '../enums/product-metrics-view-type.enum';

export interface ProductMetricsData {
  positionId: string;
  contextPositionId?: string;
  entityTypeCode?: string;
  filter: MyPerformanceFilterState;
  selectedEntityType: EntityType;
  selectedBrandCode?: string;
  products?: ProductMetrics;
  productMetricsViewType?: ProductMetricsViewType;
}

@Injectable()
export class ProductMetricsService {

  constructor(
    private productMetricsApiService: ProductMetricsApiService,
    private productMetricsTransformerService: ProductMetricsTransformerService
  ) { }

  public getProductMetrics(productMetricsData: ProductMetricsData): Observable<ProductMetricsData> {
    let apiCalls: Observable<ProductMetricsDTO>[] = [];

    const aggregationLevel = productMetricsData.selectedBrandCode ? ProductMetricsAggregationType.sku : ProductMetricsAggregationType.brand;

    if (productMetricsData.selectedEntityType === EntityType.Person) {
      apiCalls.push(this.productMetricsApiService.getPositionProductMetrics(
        productMetricsData.positionId,
        productMetricsData.filter,
        aggregationLevel
      ));
      if (aggregationLevel === ProductMetricsAggregationType.sku) {
        apiCalls.push(this.productMetricsApiService.getPositionProductMetrics(
          productMetricsData.positionId,
          productMetricsData.filter,
          ProductMetricsAggregationType.brand
        ));
      }
    } else if (productMetricsData.selectedEntityType === EntityType.Account) {
      apiCalls.push(this.productMetricsApiService.getAccountProductMetrics(
        productMetricsData.positionId,
        productMetricsData.contextPositionId,
        productMetricsData.filter,
        aggregationLevel
      ));
      if (aggregationLevel === ProductMetricsAggregationType.sku) {
        apiCalls.push(this.productMetricsApiService.getAccountProductMetrics(
          productMetricsData.positionId,
          productMetricsData.contextPositionId,
          productMetricsData.filter,
          ProductMetricsAggregationType.brand
        ));
      }
    } else if (productMetricsData.selectedEntityType === EntityType.RoleGroup) {
      apiCalls.push(this.productMetricsApiService.getRoleGroupProductMetrics(
        productMetricsData.positionId,
        productMetricsData.entityTypeCode,
        productMetricsData.filter,
        aggregationLevel
      ));
      if (aggregationLevel === ProductMetricsAggregationType.sku) {
        apiCalls.push(this.productMetricsApiService.getRoleGroupProductMetrics(
          productMetricsData.positionId,
          productMetricsData.entityTypeCode,
          productMetricsData.filter,
          ProductMetricsAggregationType.brand
        ));
      }
    }

    const allCalls: Observable<ProductMetricsDTO[]> = Observable.forkJoin(apiCalls);

    return allCalls.map((productMetricsDTOs: ProductMetricsDTO[]) => {
      const metrics: ProductMetrics = this.productMetricsTransformerService.transformAndCombineProductMetricsDTOs(productMetricsDTOs);
      const viewType = metrics.skuValues ? ProductMetricsViewType.skus : ProductMetricsViewType.brands;
      return Object.assign({}, productMetricsData, {
        products: metrics,
        productMetricsViewType: viewType
      });
    });
  }

  public filterProductMetricsBrand(productMetricsData: ProductMetricsData): Observable<ProductMetricsData> {
    if (productMetricsData.selectedBrandCode && productMetricsData.products && productMetricsData.products.skuValues) {
      return Observable.of(Object.assign({}, productMetricsData, {
        products: {
          brandValues: productMetricsData.products.brandValues,
          skuValues: productMetricsData.products.skuValues.filter((productMetricsValues: ProductMetricsValues) => {
            return productMetricsValues.brandCode === productMetricsData.selectedBrandCode;
          })
        }
      }));
    } else {
      return Observable.of(productMetricsData);
    }
  }
}
