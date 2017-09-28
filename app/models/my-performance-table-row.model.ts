import { EntityType } from '../enums/entity-responsibilities.enum';

export interface MyPerformanceTableRowMetadata {
  positionId: string;
  contextPositionId?: string;
  entityType: EntityType;
}

export interface MyPerformanceTableRow {
  descriptionRow0: string;
  descriptionRow1?: string;
  metricColumn0: number;
  metricColumn1: number;
  metricColumn2: number;
  ctv: number;
  metadata?: MyPerformanceTableRowMetadata;
}
