import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/publishReplay';
import { CompassVersionState } from '../../../state/reducers/compass-version.reducer';
import { AppState } from '../../../state/reducers/root.reducer';
import { ActionStatus } from '../../../enums/action-status.enum';
import { AppVersion } from '../../../models/app-version.model';

@Component({
  selector: 'settings',
  template: require('./settings.component.pug')
})
export class SettingsComponent implements OnInit, OnDestroy {
  firstName: string;
  lastName: string;
  versionNumber: string;
  versionHash: string;
  versionStatus: string;

  compassVersionStateSubscription: Subscription;          // SOLUTION 1
  compassVersionState$: Observable<CompassVersionState>;  // SOLUTIONS 1 & 2
  version$: Observable<AppVersion>;                       // SOLUTION 3

  constructor(
    @Inject('userService') private userService: any,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.firstName = this.userService.model.currentUser.firstName;
    this.lastName = this.userService.model.currentUser.lastName;

    // SOLUTIONS 1 & 2
    this.compassVersionState$ = this.store.select(state => state.compassVersion);

    // SOLUTION 1
    this.compassVersionStateSubscription = this.compassVersionState$.subscribe((state: CompassVersionState) => {
      console.log('Manual subscription function updating version info', ActionStatus[state.status], state.version);
      this.versionNumber = state.version.version;
      this.versionHash = state.version.hash;
      this.versionStatus = ActionStatus[state.status];
    });

    // SOLUTION 3
    this.version$ = this.store.select(state => state.compassVersion.version)
      .do(version => {
        // JUST FOR VIEWING SUBSCRIPTIONS
        console.log('version observable from async pipe updating', version.version);
      })

      // not doing anything else ends up with multiple subscriptions per async pipe on the same object.
      // not horrible in this case, but best practice dictates another way.

      // this works to share the observable,
      // but first value emitted is null for every subscription after the first one
      // .share();

      // https://stackoverflow.com/a/42199718/4618864
      .publishReplay(1) // provides last item in Observable to each additional subscriber (rather than null after 1st)
      .refCount(); // keeps subject open until all have disconnected (multicast hot observable)
  }

  ngOnDestroy() {
    // SOLUTION 1
    this.compassVersionStateSubscription.unsubscribe();
  }
}
