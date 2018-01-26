import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CompassSelectOption } from '../../../models/compass-select-component.model';

@Component({
  selector: 'compass-select',
  template: require('./compass-select.component.pug'),
  styles: [require('./compass-select.component.scss')]
})

export class CompassSelectComponent {
  @Output() onOptionSelected = new EventEmitter<any>();

  @Input() set model(modelValue: any) {
    this.componentModel = modelValue;
    this.initValues();
  }
  @Input() set options(optionCollection: Array<CompassSelectOption>) {
    this.optionData = optionCollection;
    this.initValues();
  }
  @Input() title?: string;

  private componentModel: any;
  private currentValueDisplay: string;
  private currentSubValueDisplay: string;
  private isSelectOpen: boolean = false;
  private optionData: Array<CompassSelectOption> = [];

  public optionClicked(option: CompassSelectOption): void {
    // Setting 'isSelectOpen' to false here updates styles earlier when select is closing, fixing a style issue.
    // This is also set to false in the markup to handle select closing when off clicking.
    this.isSelectOpen = false;
    this.currentValueDisplay = option.display;
    this.currentSubValueDisplay = option.subDisplay;
    this.onOptionSelected.emit(option.value);
  }

  public toggleOpen(open: boolean): void {
    this.isSelectOpen = open;
  }

  private initValues(): void {
    if (this.optionData.length) {
      this.optionData.forEach(option => {
        if (option.value === this.componentModel) {
          this.currentValueDisplay = option.display;
          if (option.subDisplay) this.currentSubValueDisplay = option.subDisplay;
        }
      });
    }
  }
}
