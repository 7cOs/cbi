import { EntityType } from '../enums/entity-responsibilities.enum';
import { SkuPackageType } from '../enums/sku-package-type.enum';

export interface MyPerformanceTableRowMetadata {
  positionId?: string;
  contextPositionId?: string;
  alternateHierarchyId?: string;
  entityType?: EntityType;
  entityTypeCode?: string;
  brandCode?: string;
  skuPackageCode?: string;
  skuPackageType?: SkuPackageType;
  entityName?: string;
}

export interface MyPerformanceTableRow {
  descriptionRow0: string;
  descriptionRow1?: string;
  metricColumn0: number;
  metricColumn1: number;
  metricColumn2: number;
  ctv: number;
  metadata?: MyPerformanceTableRowMetadata;
  performanceError?: boolean;
}
