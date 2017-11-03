import { PremiseTypeValue } from './premise-type.enum';
import { ProductMetricHeaderProductType } from './team-performance-table-header.enum';

export enum ProductMetricsViewType {
  brands = 'brands',
  skus = 'skus'
}

export namespace ProductMetricsViewType {
  export function getSingularLabel(viewType: ProductMetricsViewType, premiseType: PremiseTypeValue) {
    switch (viewType) {
      case ProductMetricsViewType.brands:
        return ProductMetricHeaderProductType.Brand;
      case ProductMetricsViewType.skus:
        return premiseType === PremiseTypeValue.On
          ? ProductMetricHeaderProductType.Package
          : ProductMetricHeaderProductType.SKU;
      default:
        throw new Error(`ProductMetricsViewType of ${ viewType } does not exist!`);
    }
  }
}
