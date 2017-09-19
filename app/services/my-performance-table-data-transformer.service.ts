import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { EntitiesTotalPerformances } from '../models/entities-total-performances.model';
import { EntitiesPerformances } from '../models/entities-performances.model';
import { GroupedEntities } from '../models/grouped-entities.model';
import { ViewType } from '../enums/view-type.enum';
import { EntityPeopleType } from '../enums/entity-responsibilities.enum';

@Injectable()
export class MyPerformanceTableDataTransformerService {

  public getLeftTableData(entities: EntitiesPerformances[],
                          peopleGroup: GroupedEntities,
                          view: ViewType): MyPerformanceTableRow[] {

    return entities.map((entity: EntitiesPerformances) => {
      let isOpen: boolean = false;
      if (entity.name === 'Open' && view === ViewType.people) {
        // entity.subName = null;
console.log(' groups  ', peopleGroup[EntityPeopleType['KEY ACCOUNT MANAGER']]);
//         for (let obj in peopleGroup[EntityPeopleType['KEY ACCOUNT MANAGER']]) {
//           if (obj === entity.positionId) console.log('HELLO!!!'); // entity.subName = obj.subName;
// console.log(' obj ', obj);
//         }
          //   (positionId: string = entity.positionId) => {
          //   for (let ent of peopleGroup.map){
          //     if (ent.positionId === positionId){
          //       return ent.subName;
          //     }
          //   }
          // };
      }
      return {
        descriptionRow0: entity.name + ((isOpen) ? '\n' + entity.subName : ''),
        metricColumn0: entity.performanceTotal.total,
        metricColumn1: entity.performanceTotal.totalYearAgo,
        metricColumn2: entity.performanceTotal.totalYearAgoPercent,
        ctv: entity.performanceTotal.contributionToVolume,
        metadata: {
          positionId: entity.positionId
        }
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
}
