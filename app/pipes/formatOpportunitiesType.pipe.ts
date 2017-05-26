import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatOpportunitiesType'})
export class FormatOpportunitiesTypePipe implements PipeTransform {
  map = {
    'Mixed': 'Custom',
    'ND001': 'New Distribution',
    'ND_001': 'New Distribution',
    'AT_RISK': 'At Risk',
    'NON_BUY': 'Non-Buy',
    'NEW_PLACEMENT_NO_REBUY': 'New Placement No Rebuy',
    'NEW_PLACEMENT_QUALITY': 'New Placement Quality',
    'LOW_VELOCITY': 'Low Velocity'
  };

  transform(rawType: string): string {
    return this.map[rawType] || rawType;
  }
}
