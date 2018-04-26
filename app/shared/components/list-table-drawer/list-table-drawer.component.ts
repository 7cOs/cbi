import { Component } from '@angular/core';

@Component({
  selector: 'list-table-drawer',
  template: require('./list-table-drawer.component.pug'),
  styles: [require('./list-table-drawer.component.scss')]
})

export class ListTableDrawerComponent {
  public opportunitiesData: any = [{
    mandate: 'SP',
    brand: 'Corona Extra',
    skuPackage: '16OZ 6PK CAN',
    type: 'Low Velocity',
    status: 'Closed',
    impact: 'high',
    current: '12,212',
    yearAgo: '4.5%',
    depletionDate: '02/21/2018',
    checked: false
  }, {
    mandate: null,
    brand: 'TOCAYO IPA',
    skuPackage: 'ANY',
    type: 'New Placement (No Rebuy)',
    status: 'Targeted',
    impact: 'low',
    current: '12,212',
    yearAgo: '4.5%',
    depletionDate: '03/14/2018',
    checked: true
  }];

  public onCheckboxClick(isChecked: boolean, index: number): void {
    this.opportunitiesData[index].checked = isChecked;
  }
}
