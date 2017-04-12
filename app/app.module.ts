import { NgModule, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { UpgradeAdapter } from '@angular/upgrade';
import { Angulartics2, Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

import { SettingsComponent } from './shared/components/settings/settings.component';

// Using forwardRef() to reference AppModule passed to UpgradeAdapter, because AppModule
// takes upgraded components created by UpgradeAdapter in its definition
export const AppUpgradeAdapter = new UpgradeAdapter(forwardRef(() => AppModule)); // tslint:disable-line:variable-name

// make ng1 components available to ng2 code & templates (these are passed as declarations)
// const myComponent = AppUpgradeAdapter.upgradeNg1Component('myComponent');

// make ng1 services available to ng2 code (these are NOT passed as providers)
// https://angular.io/docs/ts/latest/api/upgrade/index/UpgradeAdapter-class.html#!#upgradeNg1Provider-anchor
AppUpgradeAdapter.upgradeNg1Provider('userService');
AppUpgradeAdapter.upgradeNg1Provider('versionService');

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([ {path: 'placeholder', redirectTo: '/'} ]), // need ng2 router for angulartics2 to work
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])
  ],
  declarations: [ SettingsComponent ],
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
