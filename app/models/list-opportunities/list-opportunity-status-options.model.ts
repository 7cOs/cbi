import { CompassSelectOption } from '../compass-select-component.model';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';

export const listOpportunityStatusOptions: Array<CompassSelectOption> = [{
  display: 'All',
  value: OpportunityStatus.all
  },
  {
  display: 'Targeted',
  value: OpportunityStatus.targeted
  },
  {
  display: 'Closed',
  value: OpportunityStatus.closed
}];
