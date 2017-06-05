import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'titleCase'})
export class TitleCasePipe implements PipeTransform {

  public transform(input: string): string {
    return !input.length
      ? ''
      : input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
  };
}
