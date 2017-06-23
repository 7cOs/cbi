import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cbi-select',
  template: require('./cbi-select.component.pug'),
  styles: [require('./cbi-select.component.scss')]
})

export class CbiSelectComponent implements OnInit {
  @Output() onOptionSelected = new EventEmitter<any>();

  @Input() displayKey: string;
  @Input() options: any[];
  @Input() subDisplayKey?: string;
  @Input() title?: string;
  @Input() valueKey: string;

  private currentSubValue: any;
  private model: any;
  // tslint:disable-next-line:no-unused-variable
  private isSelectOpen: boolean = false;

  constructor() {}

  ngOnInit() {
    this.model = this.options[0][this.valueKey];
    if (this.subDisplayKey) this.currentSubValue = this.options[0][this.subDisplayKey];
  }

  // tslint:disable-next-line:no-unused-variable
  private optionClicked(option: any) {
    this.onOptionSelected.emit(option);
  }
}
