import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Person } from '../models/person.model';

@Injectable()
export class ResponsibilitiesTransformerService {
  constructor() { }

  public groupPeopleByRoleGroups(people: Person[]): any {
    let roleGroups = {};
    people.map((person: Person) => {
      if (Array.isArray(roleGroups[person.type])) {
        roleGroups[person.type].push(person);
      } else {
        roleGroups[person.type] = [person];
      }
    });
    return roleGroups;
  }
}
