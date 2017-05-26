import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publishReplay';
import { AppState } from '../../../state/reducers/root.reducer';
import { AppVersion } from '../../../models/app-version.model';

@Component({
  selector: 'settings',
  template: require('./settings.component.pug')
})
export class SettingsComponent implements OnInit {
  firstName: string;
  lastName: string;
  version$: Observable<AppVersion>;

  constructor(
    @Inject('userService') private userService: any,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.firstName = this.userService.model.currentUser.firstName;
    this.lastName = this.userService.model.currentUser.lastName;
    this.version$ = this.store.select(state => state.compassVersion.version)
      .publishReplay(1)
      .refCount();
  }
}
