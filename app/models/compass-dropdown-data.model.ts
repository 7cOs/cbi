import { CompassDropdownItem } from './compass-dropdown-item.model';
import { CssStyles } from './css-styles.model';

export interface CompassDropdownData {
  data: CompassDropdownItem[];
  styles?: CssStyles;
}
