import { Angulartics2, Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { MdSelectModule } from '@angular/material';
import { NgModule, forwardRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { UpgradeAdapter } from '@angular/upgrade';

import { AppComponent } from './shared/containers/app/app.component';
import { CbiSelectComponent } from './shared/components/cbi-select/cbi-select.component';
import { EffectsModule } from './state/effects/effects.module';
import { GreetingComponent } from './shared/components/greeting/greeting.component';
import { FormatOpportunitiesTypePipe } from './pipes/formatOpportunitiesType.pipe';
import { NotificationsComponent } from './shared/components/Notifications/notifications.component';
import { rootReducer } from './state/reducers/root.reducer';
import { SettingsComponent } from './shared/components/settings/settings.component';
import { TimeAgoPipe } from './pipes/timeAgo.pipe';

export const AppUpgradeAdapter = new UpgradeAdapter(forwardRef(() => AppModule)); // tslint:disable-line:variable-name no-use-before-declare

// make ng1 components available to ng2 code & templates (these are passed as declarations)
const UpgradedComponents = [  // tslint:disable-line:variable-name
  AppUpgradeAdapter.upgradeNg1Component('navbar'),
  AppUpgradeAdapter.upgradeNg1Component('appView')
];

// make ng1 services available to ng2 code (these are NOT passed as providers)
AppUpgradeAdapter.upgradeNg1Provider('userService');
AppUpgradeAdapter.upgradeNg1Provider('versionService');

@NgModule({
  declarations: [
    AppComponent,
    CbiSelectComponent,
    GreetingComponent,
    SettingsComponent,
    NotificationsComponent,
    FormatOpportunitiesTypePipe,
    TimeAgoPipe,
    ...UpgradedComponents
  ],
  imports: [
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    BrowserModule,
    BrowserAnimationsModule,
    EffectsModule,
    HttpModule,
    MdSelectModule,
    RouterModule.forRoot([ {path: 'placeholder', redirectTo: '/'} ]), // need ng2 router for angulartics2 to work
    StoreModule.provideStore(rootReducer)
  ],
  exports: [
    MdSelectModule
  ],
  providers: [ ]
})
export class AppModule {
  constructor(angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    // Note: must keep angulartics2GoogleAnalytics constructor param so that it gets instantiated

    // disable automatic page view tracking
    angulartics2.virtualPageviews(false);
    angulartics2.firstPageview(false);
  }
}
