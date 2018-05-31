import { Component, EventEmitter, Inject, InjectionToken, Input, OnInit, Optional, Output } from '@angular/core';

import { CompassDropdownData } from '../../../models/compass-dropdown-data.model';
import { CompassDropdownItem } from '../../../models/compass-dropdown-item.model';
import { CssStyles } from '../../../models/css-styles.model';

export const COMPASS_DROPDOWN_DATA = new InjectionToken<CompassDropdownData>('COMPASS_DROPDOWN_DATA');

@Component({
  selector: 'compass-dropdown',
  template: require('./compass-dropdown.component.pug'),
  styles: [require('./compass-dropdown.component.scss')]
})

export class CompassDropdownComponent implements OnInit {
  @Output() onCompassDropdownClicked = new EventEmitter<string>();

  @Input() compassDropdownItems: CompassDropdownItem[] = [];
  @Input() compassDropdownStyles: CssStyles = {};

  private dropdownItems: CompassDropdownItem[];
  private dropdownStyles: CssStyles;

  constructor(
    @Optional() @Inject(COMPASS_DROPDOWN_DATA) public injectedDropdownData: CompassDropdownData
  ) { }

  ngOnInit() {
    this.dropdownItems = this.injectedDropdownData ? this.injectedDropdownData.data : this.compassDropdownItems;
    this.dropdownStyles = this.injectedDropdownData ? this.injectedDropdownData.styles : this.compassDropdownStyles;
  }

  dropdownItemClicked(itemValue: string): void {
    this.onCompassDropdownClicked.emit(itemValue);
  }
}
