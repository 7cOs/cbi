import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../state/reducers/root.reducer';
import { ColumnType } from '../../enums/column-type.enum';
import { DateRange } from '../../models/date-range.model';
import { FetchResponsibilitiesAction } from '../../state/actions/responsibilities.action';
import * as MyPerformanceVersionActions from '../../state/actions/my-performance-version.action';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { ResponsibilitiesState } from '../../state/reducers/responsibilities.reducer'; // tslint:disable-line:no-unused-variable
import { MyPerformanceState, MyPerformanceData } from '../../state/reducers/my-performance.reducer';
import { RowType } from '../../enums/row-type.enum';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { ViewType } from '../../enums/view-type.enum';

// mocks
import { myPerformanceTableData,
         myPerformanceTotalRowData,
         myPerformanceRightTableData } from '../../models/my-performance-table-data.model.mock';

@Component({
  selector: 'my-performance',
  template: require('./my-performance.component.pug'),
  styles: [require('./my-performance.component.scss')]
})
export class MyPerformanceComponent implements OnInit {
  public roleGroups: Observable<ResponsibilitiesState>;
  public viewType = ViewType;
  public showLeftBackButton = false;

  // mocks
  public tableHeaderRowLeft: Array<string> = ['PEOPLE', 'DEPLETIONS', 'CTV'];
  public tableHeaderRowRight: Array<string> = ['BRAND', 'DEPLETIONS', 'CTV'];
  public performanceMetric: string = 'Depletions';
  public dateRange: DateRange = getDateRangeMock();
  public tableData: MyPerformanceTableRow[] = myPerformanceTableData;
  public rightTableData: MyPerformanceTableRow[] = myPerformanceRightTableData;
  public totalRowData: MyPerformanceTableRow = myPerformanceTotalRowData;
  public showOpportunities: boolean = true;
  public sortingCriteria: Array<SortingCriteria> = [
    {
      columnType: ColumnType.metricColumn0,
      ascending: false
    }
  ];

  private currentState: MyPerformanceData;

  constructor(private store: Store<AppState>,
              private myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService) {
    this.store.select('myPerformance').subscribe((myPerformanceState: MyPerformanceState) => {
      this.tableData = this.myPerformanceTableDataTransformerService
      .transformRoleGroupTableData(myPerformanceState.current.responsibilities.responsibilities);

      this.currentState = myPerformanceState.current;
      console.log(myPerformanceState.versions.length);
      this.showLeftBackButton = myPerformanceState.versions.length > 0;
    });
  }

  public handleSortRows(criteria: SortingCriteria[]): void {
    this.sortingCriteria = criteria;
  }

  public handleElementClicked(leftSide: boolean, type: RowType, index: number, row?: MyPerformanceTableRow): void {
    switch (type) {
      case RowType.total:
        if (leftSide) {
          if (this.showLeftBackButton) {
            this.store.dispatch(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());
          }
          console.log(`clicked on cell ${index} from the left side`);
        } else {
          console.log(`clicked on cell ${index} from the right side`);
        }
        break;

      case RowType.data:
      default:
        if (leftSide) {
          this.store.dispatch(new MyPerformanceVersionActions.SaveMyPerformanceStateAction(this.currentState));
          console.log('clicked on left row:', row);
        } else {
          console.log('clicked on right row:', row);
        }
        break;
    }
  }

  ngOnInit() {
    // stub current user for now
    const currentUserId = 1;
    this.store.dispatch(new FetchResponsibilitiesAction(currentUserId));
  }
}
