import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'compass-select',
  template: require('./compass-select.component.pug'),
  styles: [require('./compass-select.component.scss')]
})

export class CompassSelectComponent {
  @Output() onOptionSelected = new EventEmitter<any>();

  @Input() displayKey: string;
  @Input() model: string;
  @Input() subDisplayKey?: string;
  @Input() title?: string;
  @Input() valueKey: string;
  @Input() set options(optionCollection: any[]) {
    this.optionData = optionCollection;
    if (this.subDisplayKey) this.initSubValue();
  }

  private currentSubValue: any;
  private isSelectOpen: boolean = false;
  private optionData: any[] = [];

  constructor() {}

  private initSubValue(): void {
    this.optionData.forEach(option => {
      if (option[this.valueKey] === this.model) this.currentSubValue = option[this.subDisplayKey];
    });
  }

  // tslint:disable-next-line:no-unused-variable
  private optionClicked(option: any): void {
    this.isSelectOpen = false;
    this.currentSubValue = option[this.subDisplayKey];
    this.onOptionSelected.emit(option[this.valueKey]);
  }
}
