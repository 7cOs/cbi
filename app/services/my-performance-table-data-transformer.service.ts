import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { EntitiesTotalPerformances } from '../models/entities-total-performances.model';
import { EntitiesPerformances } from '../models/entities-performances.model';
import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { EntityPeopleType } from '../enums/entity-responsibilities.enum';
import { GroupedEntities } from '../models/grouped-entities.model';
import { ViewType } from '../enums/view-type.enum';

@Injectable()
export class MyPerformanceTableDataTransformerService {

  public getLeftTableData(entities: EntitiesPerformances[],
                          peopleGroup: GroupedEntities,
                          view: ViewType): MyPerformanceTableRow[] {

    return entities.map((entity: EntitiesPerformances) => {
      let isOpen: boolean = false;
      let localSubName: string;
      let localName: string = entity.name;

      if (entity.name === 'Open' && view === ViewType.people) {
        (peopleGroup[EntityPeopleType['KEY ACCOUNT MANAGER']]).map((person: EntityResponsibilities) => {
          if (person.positionId === entity.positionId) {
            isOpen = true;
            localSubName = person.subName;
            localName = 'Open Position';
          }
        });
      }
      return {
        descriptionRow0: localName + ((isOpen) ? '\n' + localSubName : ''),
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
