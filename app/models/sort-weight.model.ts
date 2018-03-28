import { SpecialistRoleGroupEntityTypeCode } from '../enums/specialist-role-group-entity-type-code.enum';

export interface SortWeight {
  index: number;
  sortWeight: number;
}

export const GEOGRAPHY_SORTING_WEIGHT = 999;

/*Adding a Object with some number that carries high weights since below role groups should always be
sorted at the bottom according to weights*/
export const specializedRoleGroupWeights = {
  [SpecialistRoleGroupEntityTypeCode.GEO_BUSINESS_UNITS]: 995,
  [SpecialistRoleGroupEntityTypeCode.NATIONAL_SALES_ORG]: 996,
  [SpecialistRoleGroupEntityTypeCode.DRAFT]: 997
};
