import { Observable } from 'rxjs';
import { V3List } from '../../../models/lists/lists.model';
import { getV3ListMock } from '../../../models/lists/lists.model.mock';
import { generateRandomSizedArray } from '../../../models/util.model';

export const listApiServiceMock = {
  addOpportunitiesToList: addOpportunitiesToList,
  createList: createList,
  getLists: getLists,
  getListsPromise: getListsPromise
};

function getLists(): Observable<V3List[]> {
  const v3ListsCollection = generateRandomSizedArray(1, 20).map(() => getV3ListMock());
  return Observable.of(v3ListsCollection);
}

function getListsPromise(): Promise<V3List[]> {
  return getLists().toPromise();
}

function addOpportunitiesToList(...args: any[]): Observable<any> {
  return Observable.of({});
}

function createList(): Observable<V3List> {
  return Observable.of(getV3ListMock());
}
