import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

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
    let dtos: Observable<ProductMetricsDTO | Error>;

    const aggregationLevel = productMetricsData.selectedBrandCode ? ProductMetricsAggregationType.sku : ProductMetricsAggregationType.brand;

    if (productMetricsData.selectedEntityType === EntityType.Person) {
      dtos = this.productMetricsApiService.getPositionProductMetrics(
        productMetricsData.positionId,
        productMetricsData.filter,
        aggregationLevel
      );
    } else if (productMetricsData.selectedEntityType === EntityType.Account) {
      dtos = this.productMetricsApiService.getAccountProductMetrics(
        productMetricsData.positionId,
        productMetricsData.contextPositionId,
        productMetricsData.filter,
        aggregationLevel
      );
    } else if (productMetricsData.selectedEntityType === EntityType.RoleGroup) {
      dtos = this.productMetricsApiService.getRoleGroupProductMetrics(
        productMetricsData.positionId,
        productMetricsData.entityTypeCode,
        productMetricsData.filter,
        aggregationLevel
      );
    }

    return dtos.map((productMetricsDTO: ProductMetricsDTO) => {
      return Object.assign({}, productMetricsData, {
        products: this.productMetricsTransformerService.transformProductMetrics(productMetricsDTO),
        productMetricsViewType: productMetricsDTO.brandValues ? ProductMetricsViewType.brands : ProductMetricsViewType.skus
      });
    });
  }

  public checkEmptyProductMetricsResponse(productMetricsData: ProductMetricsData): Observable<ProductMetricsData> {
    if (productMetricsData && Object.keys(productMetricsData.products).length === 0) {
      return Observable.throw('Empty Product Metrics Data Error');
    }
    return Observable.of(productMetricsData);
  }

  public filterProductMetricsBrand(productMetricsData: ProductMetricsData): Observable<ProductMetricsData> {
    if (productMetricsData.selectedBrandCode && productMetricsData.products && productMetricsData.products.skuValues) {
      return Observable.of(Object.assign({}, productMetricsData, {
        products: {
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
