import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'compass-radio',
  template: require('./compass-radio.component.pug'),
  styles: [require('./compass-radio.component.scss')]
})

export class CompassRadioComponent {
  @Output() onRadioClicked = new EventEmitter<any>();

  @Input() displayKey: string;
  @Input() direction: string;
  @Input() model: string;
  @Input() title?: string;
  @Input() valueKey: string;
  @Input() options: Array<any>;

  private radioClicked(option: any): void { // tslint:disable-line:no-unused-variable
    this.onRadioClicked.emit(option[this.valueKey]);
  }
}
