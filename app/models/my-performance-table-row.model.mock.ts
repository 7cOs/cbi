import * as Chance from 'chance';

import { EntityType } from '../enums/entity-responsibilities.enum';
import { MyPerformanceTableRow, TeamPerformanceTableOpportunity } from './my-performance-table-row.model';

const chance = new Chance();
const entityTypeValues = Object.keys(EntityType).map(key => EntityType[key]);

export function getMyPerformanceTableRowMock(length: number) {
  let rows: Array<MyPerformanceTableRow> = Array<MyPerformanceTableRow>();

  for (let i = 0 ; i < length ; i++) {
    rows.push({
      descriptionRow0: chance.string(),
      descriptionRow1: chance.string(),
      metricColumn0: chance.floating(),
      metricColumn1: chance.floating(),
      metricColumn2: chance.floating(),
      ctv: chance.natural(),
      metadata: {
        positionId: chance.string(),
        contextPositionId: chance.string(),
        entityType: entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})],
        entityTypeCode: chance.string(),
        entityName: chance.string(),
        brandCode: chance.string(),
        skuPackageCode: chance.string()
      }
    });
  }

  return rows;
}

export function getTeamPerformanceTableOpportunityMock(): TeamPerformanceTableOpportunity {
  return {
    name: chance.string({ length: 20 }),
    count: chance.natural({ max: 999999999999 })
  };
}

export function getTeamPerformanceTableOpportunitiesMock(): Array<TeamPerformanceTableOpportunity> {
  return Array(chance.natural({min: 1, max: 20})).fill('').map(() => getTeamPerformanceTableOpportunityMock());
}
