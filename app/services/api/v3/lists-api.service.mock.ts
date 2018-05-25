import { getV3ListMock } from '../../../models/lists/lists.model.mock';
import { generateRandomSizedArray } from '../../../models/util.model';
import { V3List } from '../../../models/lists/v3-list.model';

import { Observable } from 'rxjs';

export const listApiServiceMock = {
  addOpportunitiesToList: addOpportunitiesToList,
  createList: createList,
  getLists: getLists,
  getListsPromise: getListsPromise,
  createListPromise: createListPromise,
  addOpportunitiesToListPromise: addOpportunitiesToListPromise,
  updateListPromise: updateListPromise,
  updateList: updateList,
  deleteList: deleteList,
  deleteListPromise: deleteListPromise,
  addStoresToList: addStoresToList,
  addStoresToListPromise: addStoresToListPromise
};

function getLists(): Observable<V3List[]> {
  const v3ListsCollection = generateRandomSizedArray(1, 20).map(() => getV3ListMock());
  return Observable.of(v3ListsCollection);
}

function getListsPromise(): Promise<V3List[]> {
  return getLists().toPromise();
}

function updateList(): Observable<any> {
  return Observable.of({});
}

function updateListPromise(): Promise<V3List[]> {
  return updateList().toPromise();
}

function addOpportunitiesToList(...args: any[]): Observable<any> {
  return Observable.of({});
}

function addOpportunitiesToListPromise(...args: any[]): Promise<any> {
  return addOpportunitiesToList(...args).toPromise();
}

function createList(...args: any[]): Observable<V3List> {
  return Observable.of(getV3ListMock());
}

function createListPromise(...args: any[]): Promise<V3List> {
  return createList().toPromise();
}

function deleteList(...args: any[]): Observable<any> {
  return Observable.of({});
}

function deleteListPromise(...args: any[]): Promise<any> {
  return deleteList().toPromise();
}

function addStoresToList(...args: any[]): Observable<any> {
  return Observable.of({});
}

function addStoresToListPromise(...args: any[]): Promise<any> {
  return addStoresToList().toPromise();
}
