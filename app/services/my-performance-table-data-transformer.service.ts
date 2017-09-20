import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { EntitiesTotalPerformances } from '../models/entities-total-performances.model';
import { EntitiesPerformances } from '../models/entities-performances.model';
import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { EntityPeopleType } from '../enums/entity-responsibilities.enum';
import { GroupedEntities } from '../models/grouped-entities.model';
import { ProductMetrics, ProductMetricsBrandValue } from '../models/product-metrics.model';
import { ViewType } from '../enums/view-type.enum';

@Injectable()
export class MyPerformanceTableDataTransformerService {

  public getLeftTableData(entities: EntitiesPerformances[],
                          peopleGroup: GroupedEntities,
                          view: ViewType): MyPerformanceTableRow[] {

    return entities.map((entity: EntitiesPerformances) => {
      if (view === ViewType.people && entity.name === 'Open') {
        return this.getOpenPositionCase(entity, peopleGroup);
      } else {
        return {
          descriptionRow0: entity.name,
          metricColumn0: entity.performanceTotal.total,
          metricColumn1: entity.performanceTotal.totalYearAgo,
          metricColumn2: entity.performanceTotal.totalYearAgoPercent,
          ctv: entity.performanceTotal.contributionToVolume,
          metadata: {
            positionId: entity.positionId
          }
        };
      }
    });
  }

  public getRightTableData(productMetrics: ProductMetrics): MyPerformanceTableRow[] {
    return (productMetrics.brand).map((item: ProductMetricsBrandValue) => {
      return {
        descriptionRow0: item.brandDescription,
        metricColumn0: item.current,
        metricColumn1: item.yearAgo,
        metricColumn2: item.yearAgoPercent,
        ctv: chance.natural({max: 100})
      };
    });
  }

  public getTotalRowData(performanceTotal: EntitiesTotalPerformances): MyPerformanceTableRow {
    const totalRow = {
      descriptionRow0: 'Total',
      metricColumn0: performanceTotal.total,
      metricColumn1: performanceTotal.totalYearAgo,
      metricColumn2: performanceTotal.totalYearAgoPercent,
      ctv: performanceTotal.contributionToVolume
    };

    if (performanceTotal.name) totalRow['descriptionRow1'] = performanceTotal.name;

    return totalRow;
  }

  private getOpenPositionCase(entity: EntitiesPerformances, peopleGroup: GroupedEntities): MyPerformanceTableRow {
    let localName: string = entity.name;
    let localSubName: string = entity.name;

    Object.keys(EntityPeopleType).filter(entityPeopleTypeKey => {
      if (peopleGroup[EntityPeopleType[entityPeopleTypeKey]]) {
        (peopleGroup[EntityPeopleType[entityPeopleTypeKey]]).map((person: EntityResponsibilities) => {
          if (person.positionId === entity.positionId) {
            localSubName = person.subName;
            localName = 'Open Position';
          }
        });
      }
    });

    return {
      descriptionRow0: localName,
      descriptionRow1: localSubName,
      metricColumn0: entity.performanceTotal.total,
      metricColumn1: entity.performanceTotal.totalYearAgo,
      metricColumn2: entity.performanceTotal.totalYearAgoPercent,
      ctv: entity.performanceTotal.contributionToVolume,
      metadata: {
        positionId: entity.positionId
      }
    };
  }
}
