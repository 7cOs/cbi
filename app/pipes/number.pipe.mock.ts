import { Pipe } from '@angular/core';

@Pipe({
  name: 'number',
  pure: false
})
export class NumberPipeMock implements Pipe {
  name: string = 'number';

  transform(query: number, ...args: any[]): any {
    return query;
  }
}
