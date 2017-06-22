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
  @Input() title?: string;

  private _model: any;
  private _options: any[];
  private _currentSubValue: any;
  private _isSelectOpen: boolean = false;

  constructor() {}

  ngOnInit() {
    this._options = this.initOptionData(this.options);
    this._model = this._options[0].value;
    if (this.subDisplayKey) this._currentSubValue = this._options[0].subDisplayValue;
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

  // tslint:disable-next-line:no-unused-variable
  private handleOnOpen(e: Event): void {
    this._isSelectOpen = true;
  }

  // tslint:disable-next-line:no-unused-variable
  private handleOnClose(e: Event): void {
    this._isSelectOpen = false;
  }
}
