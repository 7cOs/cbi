import { NgModule, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { UpgradeAdapter } from '@angular/upgrade';
import { Angulartics2, Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from './state/effects/effects.module';
import { rootReducer } from './state/reducers/root.reducer';

import { AppComponent } from './shared/containers/app/app.component';
import { GreetingComponent } from './shared/components/greeting/greeting.component';
import { SettingsComponent } from './shared/components/settings/settings.component';

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
    GreetingComponent,
    SettingsComponent,
    ...UpgradedComponents
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
