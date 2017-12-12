import { EntityType } from '../enums/entity-responsibilities.enum';
import { SkuPackageType } from '../enums/sku-package-type.enum';

export interface TeamPerformanceTableOpportunity {
  name: string;
  count: number;
}

export interface MyPerformanceTableRowMetadata {
  alternateHierarchyId?: string;
  brandCode?: string;
  contextPositionId?: string;
  entityName?: string;
  entityType?: EntityType;
  entityTypeCode?: string;
  exceptionHierarchy?: boolean;
  positionId?: string;
  skuPackageCode?: string;
  skuPackageType?: SkuPackageType;
}

export interface MyPerformanceTableRow {
  ctv: number;
  descriptionRow0: string;
  descriptionRow1?: string;
  metricColumn0: number;
  metricColumn1: number;
  metricColumn2: number;
  metadata?: MyPerformanceTableRowMetadata;
  opportunities?: (number|string);
  opportunitiesError?: boolean;
  performanceError?: boolean;
}
