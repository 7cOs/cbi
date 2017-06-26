import { Component } from '@angular/core';

@Component({
  selector: 'myPerformance',
  template: require('./my-performance.component.pug')
})

export class MyPerformanceComponent {

  private modelValue = 'CYTD';
  private modelValue2 = 'MICHAEL';
  // tslint:disable-next-line:no-unused-variable
  private selectData = [
    { name: 'FYTD', value: 'FYTD', range: '1/1/17 - 2/2/17' },
    { name: 'CYTD', value: 'CYTD', range: '2/2/17 - 3/3/17' },
    { name: 'MTD', value: 'MTD', range: '3/3/17 - 4/4/17' }
  ];
  // tslint:disable-next-line:no-unused-variable
  private selectData2 = [
    { person: 'Peter', personValue: 'PETER' },
    { person: 'Michael', personValue: 'MICHAEL' },
    { person: 'Steven', personValue: 'SEAGAL' }
  ];

  // tslint:disable-next-line:no-unused-variable
  private optionSelected(e: any) {
    this.modelValue = e;
  }

  // tslint:disable-next-line:no-unused-variable
  private optionSelected2(e: any) {
    this.modelValue2 = e;
  }
}
