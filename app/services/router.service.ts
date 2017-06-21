import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

@Injectable()
export class RouterService {

  constructor(private router: Router) {}

  goToRoute(route: string) {
    debugger;
    this.router.navigate([route]);
  }

}
