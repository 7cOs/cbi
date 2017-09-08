export interface MyPerformanceTableRowMetadata {
  positionId: string;
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
