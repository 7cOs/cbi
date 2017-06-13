import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cbi-select',
  template: require('./cbi-select.component.pug'),
  styles: [require('./cbi-select.component.scss')]
})

export class CbiSelectComponent implements OnInit {
  @Input() options: any[];
  @Input() displayKey: string;
  @Input() valueKey: string;
  @Input() subDisplayKey?: string;
  @Input() model: any;
  @Input() title?: string;

  private _options: any[];
  private isSelectOpen: boolean = false;
  private currentSubValue: any;

  constructor() {}

  ngOnInit() {
    this._options = this.initOptionData(this.options);
    if (this.subDisplayKey) this.initCurrentSubValue();
  }

  private initOptionData(options: any[]): any[] {
    return options.map(option => {
      const _option = {
        displayValue: option[this.displayKey],
        value: option[this.valueKey]
      };

      if (this.subDisplayKey) _option['subDisplayValue'] = option[this.subDisplayKey];
      return _option;
    });
  }

  private initCurrentSubValue(): void {
    this._options.forEach(option => {
      if (option.value === this.model) this.currentSubValue = option.subDisplayValue;
    });
  }

  private handleOnOpen(e: Event): void {
    this.isSelectOpen = true;
  }

  private handleOnClose(e: Event): void {
    this.isSelectOpen = false;
  }
}
