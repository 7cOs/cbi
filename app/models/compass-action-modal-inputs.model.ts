import { RadioInputModel } from '../models/compass-radio-input.model';
import { DropdownInputModel } from '../models/compass-dropdown-input.model';

export interface CompassActionModalInputs {
  title: string;
  bodyText?: string;
  radioInputModel?: RadioInputModel;
  dropdownInputModel?: DropdownInputModel;
  acceptLabel: string;
  rejectLabel: string;
}
