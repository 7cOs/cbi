import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cbi-select',
  template: require('./cbi-select.component.pug'),
  styles: [require('./cbi-select.component.scss')]
})

export class CbiSelectComponent implements OnInit {
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
  private isSelectOpen: boolean = false; // tslint:no-unused-variable
  private optionData: any[] = [];

  constructor() {}

  ngOnInit() {
    if (this.subDisplayKey) this.initSubValue();
  }

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
