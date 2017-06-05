import { Angulartics2, Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { HttpModule } from '@angular/http';
import { NgModule, forwardRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { UpgradeAdapter } from '@angular/upgrade';

import { AppComponent } from './shared/containers/app/app.component';
import { EffectsModule } from './state/effects/effects.module';
import { FormatOpportunitiesTypePipe } from './pipes/formatOpportunitiesType.pipe';
import { NotificationsComponent } from './shared/components/Notifications/notifications.component';
import { rootReducer } from './state/reducers/root.reducer';
import { SettingsComponent } from './shared/components/settings/settings.component';
import { TimeAgoPipe } from './pipes/timeAgo.pipe';

// Using forwardRef() to reference AppModule passed to UpgradeAdapter, because AppModule
// takes upgraded components created by UpgradeAdapter in its definition
export const AppUpgradeAdapter = new UpgradeAdapter(forwardRef(() => AppModule)); // tslint:disable-line:variable-name

// make ng1 components available to ng2 code & templates (these are passed as declarations)
const UpgradedComponents = [  // tslint:disable-line:variable-name
  AppUpgradeAdapter.upgradeNg1Component('navbar'),
  AppUpgradeAdapter.upgradeNg1Component('appView')
];

// make ng1 services available to ng2 code (these are NOT passed as providers)
// https://angular.io/docs/ts/latest/api/upgrade/index/UpgradeAdapter-class.html#!#upgradeNg1Provider-anchor
AppUpgradeAdapter.upgradeNg1Provider('userService');
AppUpgradeAdapter.upgradeNg1Provider('versionService');

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([ {path: 'placeholder', redirectTo: '/'} ]), // need ng2 router for angulartics2 to work
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    HttpModule,
    StoreModule.provideStore(rootReducer),
    EffectsModule
  ],
  declarations: [
    AppComponent,
    SettingsComponent,
    NotificationsComponent,
    ...UpgradedComponents,
    FormatOpportunitiesTypePipe,
    TimeAgoPipe
  ],
  providers: [ DatePipe ]
})
export class AppModule {
  constructor(angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    // Note: must keep angulartics2GoogleAnalytics constructor param so that it gets instantiated

    // disable automatic page view tracking
    angulartics2.virtualPageviews(false);
    angulartics2.firstPageview(false);
  }
}
