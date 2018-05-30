export interface DropDownMenu {
  display: string;
  value: string;
}

export interface DropdownInputModel {
  selected: string;
  dropdownOptions: DropDownMenu[];
  title: string;
}
