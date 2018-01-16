import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../models/performance.model';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../models/product-metrics.model';
import { SkuPackageType } from '../enums/sku-package-type.enum';

export interface FilterStateParameters {
  metricType: string;
  dateRangeCode: string;
  premiseType: string;
}

@Injectable()
export class ApiHelperService {

  public getBrandSkuPackageCodeParam(brandSkuCode: string, skuPackageType: SkuPackageType): { [key: string]: string } {
    const brandSkuPackageCodeParam: { [key: string]: string } = {};

    if (skuPackageType) {
      skuPackageType === SkuPackageType.sku
        ? brandSkuPackageCodeParam.masterSKU = brandSkuCode
        : brandSkuPackageCodeParam.masterPackageSKU = brandSkuCode;
    } else {
      brandSkuPackageCodeParam.brandCode = brandSkuCode;
    }

    return brandSkuPackageCodeParam;
  }

  public getFilterStateParams(filterState: MyPerformanceFilterState): FilterStateParameters {
    const metricTypeParam: string = filterState.hasOwnProperty('distributionType')
      ? `${ filterState.distributionType.toLowerCase() }PointsOfDistribution`
      : filterState.metricType === MetricTypeValue.Depletions
        ? 'volume'
        : filterState.metricType.toLowerCase();

    return {
      metricType: metricTypeParam,
      dateRangeCode: filterState.dateRangeCode,
      premiseType: filterState.premiseType
    };
  }

  public handlePerformanceNotFoundError(error: Response): Observable<PerformanceDTO> {
    if (error.status === 404) {
      return Observable.of({
        total: 0,
        totalYearAgo: 0
      });
    } else {
      return Observable.throw(new Error(error.text()));
    }
  }

  public handleProductMetricsNotFoundError(error: Response, aggregation: ProductMetricsAggregationType, metricType: string)
  : Observable<ProductMetricsDTO> {
    if (error.status === 404) {
      const emptyProductMetricDTO: ProductMetricsDTO = {
        type: metricType
      };

      aggregation === ProductMetricsAggregationType.brand
        ? emptyProductMetricDTO.brandValues = []
        : emptyProductMetricDTO.skuValues = [];

      return Observable.of(emptyProductMetricDTO);
    } else {
      return Observable.throw(new Error(error.text()));
    }
  }
}
