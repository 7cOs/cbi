import * as Chance from 'chance';

import * as BreadcrumbActions from './my-performance-breadcrumb.action';

let chance = new Chance();

describe('Responsibilities Actions', () => {

  describe('AddBreadcrumbEntityAction', () => {
    let action: BreadcrumbActions.AddBreadcrumbEntity;
    let breadcrumbEntityMock: string;

    beforeEach(() => {
      breadcrumbEntityMock = chance.string();
      action = new BreadcrumbActions.AddBreadcrumbEntity(breadcrumbEntityMock);
    });

    it('should have the correct type', () => {
      expect(BreadcrumbActions.ADD_BREADCRUMB_ENTITY).toBe('[Breadcrumb] ADD_BREADCRUMB_ENTITY');
      expect(action.type).toBe(BreadcrumbActions.ADD_BREADCRUMB_ENTITY);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(breadcrumbEntityMock);
    });
  });

  describe('RemoveBreadcrumbEntitiesAction', () => {
    let action: BreadcrumbActions.RemoveBreadcrumbEntities;
    let payload: number;

    beforeEach(() => {
      payload = chance.natural();
      action = new BreadcrumbActions.RemoveBreadcrumbEntities(payload);
    });

    it('should have the correct type', () => {
      expect(BreadcrumbActions.REMOVE_BREADCRUMB_ENTITIES)
        .toBe('[Breadcrumb] REMOVE_BREADCRUMB_ENTITIES');
      expect(action.type).toBe(BreadcrumbActions.REMOVE_BREADCRUMB_ENTITIES);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ResetBreadcrumbAction', () => {
    let action: BreadcrumbActions.ResetBreadcrumbTrail;

    beforeEach(() => {
      action = new BreadcrumbActions.ResetBreadcrumbTrail();
    });

    it('should have the correct type', () => {
      expect(BreadcrumbActions.RESET_BREADCRUMB_TRAIL)
        .toBe('[Breadcrumb] RESET_BREADCRUMB_TRAIL');
      expect(action.type).toBe(BreadcrumbActions.RESET_BREADCRUMB_TRAIL);
    });
  });
});
