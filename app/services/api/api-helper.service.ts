import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../../models/performance.model';
import { ProductMetricsAggregationType } from '../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../models/product-metrics.model';
import { SkuPackageType } from '../../enums/sku-package-type.enum';

interface FilterStateParameters {
  type?: string;
  metricType?: string;
  dateRangeCode: string;
  premiseType: string;
}

interface BrandSkuPackageCodeParam {
  brandCode?: string;
  masterPackageSKU?: string;
  masterSKU?: string;
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

  public handleProductMetricsNotFoundError(
    error: Response,
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
      return Observable.throw(new Error(error.text()));
    }
  }

  private getMetricTypeParamValue(filterState: MyPerformanceFilterState): string {
    return filterState.hasOwnProperty('distributionType')
      ? `${ filterState.distributionType.toLowerCase() }PointsOfDistribution`
      : filterState.metricType.toLowerCase();
  }
}
