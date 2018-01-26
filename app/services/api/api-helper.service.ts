import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../../models/performance.model';
import { ProductMetricsAggregationType } from '../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsValues } from '../../models/product-metrics.model';
import { SkuPackageType } from '../../enums/sku-package-type.enum';

export interface FilterStateParameters {
  type?: string;
  metricType?: string;
  dateRangeCode: string;
  premiseType: string;
}

export interface BrandSkuPackageCodeParam {
  brandCode?: string;
  masterPackageSKU?: string;
  masterSKU?: string;
}

export interface ProductMetricsNotFoundData {
  brandValues?: ProductMetricsValues[];
  skuValues?: ProductMetricsValues[];
  type: MetricTypeValue;
}

@Injectable()
export class ApiHelperService {

  public getBrandSkuPackageCodeParam(brandSkuCode: string, skuPackageType: SkuPackageType): BrandSkuPackageCodeParam {
    const brandSkuPackageCodeParam: BrandSkuPackageCodeParam = {};

    if (skuPackageType) {
      skuPackageType === SkuPackageType.sku
        ? brandSkuPackageCodeParam.masterSKU = brandSkuCode
        : brandSkuPackageCodeParam.masterPackageSKU = brandSkuCode;
    } else {
      brandSkuPackageCodeParam.brandCode = brandSkuCode;
    }

    return brandSkuPackageCodeParam;
  }

  public getHierarchyFilterStateParams(filterState: MyPerformanceFilterState): FilterStateParameters {
    return {
      metricType: this.getMetricTypeParamValue(filterState),
      dateRangeCode: filterState.dateRangeCode,
      premiseType: filterState.premiseType
    };
  }

  public getProductMetricsFilterStateParams(filterState: MyPerformanceFilterState): FilterStateParameters {
    return {
      type: this.getMetricTypeParamValue(filterState),
      dateRangeCode: filterState.dateRangeCode,
      premiseType: filterState.premiseType
    };
  }

  public handlePerformanceNotFoundError(error: Response): Observable<PerformanceDTO|Error> {
    if (error.status === 404) {
      return Observable.of({
        total: 0,
        totalYearAgo: 0
      });
    } else {
      return Observable.throw(new Error(error.text()));
    }
  }

  public handleProductMetricsNotFoundError(
    error: Response,
    aggregationLevel: ProductMetricsAggregationType,
    metricType: MetricTypeValue
  ): Observable<ProductMetricsNotFoundData|Error> {
    if (error.status === 404) {
      const emptyProductMetricDTO: ProductMetricsNotFoundData = {
        type: metricType
      };

      aggregationLevel === ProductMetricsAggregationType.brand
        ? emptyProductMetricDTO.brandValues = []
        : emptyProductMetricDTO.skuValues = [];

      return Observable.of(emptyProductMetricDTO);
    } else {
      return Observable.throw(new Error(error.text()));
    }
  }

  private getMetricTypeParamValue(filterState: MyPerformanceFilterState): string {
    return filterState.hasOwnProperty('distributionType')
      ? `${ filterState.distributionType.toLowerCase() }PointsOfDistribution`
      : filterState.metricType.toLowerCase();
  }
}
