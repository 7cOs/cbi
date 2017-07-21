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
    this.initSubValue();
  }
  @Input() set options(optionCollection: Array<CompassSelectOption>) {
    this.optionData = optionCollection;
    this.initSubValue();
  }
  @Input() title?: string;

  private componentModel: any;
  private currentSubValue: string;
  private isSelectOpen: boolean = false;
  private optionData: Array<CompassSelectOption> = [];

  private initSubValue(): void {
    if (this.optionData.length) {
      this.optionData.forEach(option => {
        if (option.value === this.componentModel) this.currentSubValue = option.subDisplay;
      });
    }
  }

  private optionClicked(option: CompassSelectOption): void { // tslint:disable-line:no-unused-variable
    // Setting 'isSelectOpen' to false here updates styles earlier when select is closing, fixing a style issue.
    // This is also set to false in the markup to handle select closing when off clicking.
    this.isSelectOpen = false;
    this.currentSubValue = option.subDisplay;
    this.onOptionSelected.emit(option.value);
  }
}
