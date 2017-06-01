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

    // Combining publish() and refCount() makes this observable hot, so that in a sense it acts
    // as 'multicast', which allows multiple subscribers (e.g. multiple async pipes in the template)
    // to subscribe and receive the same events. The publishReplay(1) variation of publish() ensures
    // that each new subscriber receives the last item from the observable stream as soon as it subscribes
    // (rather than receiving null, which it would otherwise get if another subscriber had first subscribed.
    // Info about multiple async pipes on same observable: https://stackoverflow.com/a/40819423/4618864
    // Info about publishReplay and refCount: https://stackoverflow.com/a/39604925/4618864
    this.version$ = this.store.select(state => state.compassVersion.version)
      .publishReplay(1)
      .refCount();
  }
}
