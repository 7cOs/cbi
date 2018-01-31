import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../../models/performance.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { ProductMetricsAggregationType } from '../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../models/product-metrics.model';
import { SkuPackageType } from '../../enums/sku-package-type.enum';

export interface FilterStateParameters {
  type?: string;
  metricType?: string;
  dateRangeCode: DateRangeTimePeriodValue;
  premiseType: PremiseTypeValue;
}

export interface BrandSkuPackageCodeParam {
  brandCode?: string;
  masterPackageSKU?: string;
  masterSKU?: string;
}

@Injectable()
export class ApiHelperService {

  public getBrandSkuPackageCodeParam(brandSkuCode: string, skuPackageType: SkuPackageType): BrandSkuPackageCodeParam {
    if (!brandSkuCode) return;

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

  public handlePerformanceNotFoundError(error: HttpErrorResponse): Observable<PerformanceDTO> {
    if (error.status === 404) {
      return Observable.of({
        total: 0,
        totalYearAgo: 0
      });
    } else {
      return Observable.throw(new Error(error.error));
    }
  }

  public handleProductMetricsNotFoundError(
    error: HttpErrorResponse,
    aggregationLevel: ProductMetricsAggregationType,
    metricType: MetricTypeValue
  ): Observable<ProductMetricsDTO> {
    if (error.status === 404) {
      const emptyProductMetricDTO: ProductMetricsDTO = {
        type: metricType
      };

      aggregationLevel === ProductMetricsAggregationType.brand
        ? emptyProductMetricDTO.brandValues = []
        : emptyProductMetricDTO.skuValues = [];

      return Observable.of(emptyProductMetricDTO);
    } else {
      return Observable.throw(new Error(error.error));
    }
  }

  private getMetricTypeParamValue(filterState: MyPerformanceFilterState): string {
    return filterState.hasOwnProperty('distributionType')
      ? `${ filterState.distributionType.toLowerCase() }PointsOfDistribution`
      : filterState.metricType.toLowerCase();
  }
}
