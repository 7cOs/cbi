import { Angulartics2, Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, forwardRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { UpgradeAdapter } from '@angular/upgrade';

import { AppComponent } from './shared/containers/app/app.component';
import { DateRangeComponent } from './shared/components/date-ranges/date-ranges.component';
import { DateRangeApiService } from './services/date-range-api.service';
import { DateRangeService } from './services/date-range.service';
import { DateRangeTransformerService } from './services/date-range-transformer.service';
import { EffectsModule } from './state/effects/effects.module';
import { FormatOpportunitiesTypePipe } from './pipes/formatOpportunitiesType.pipe';
import { GreetingComponent } from './shared/components/greeting/greeting.component';
import { MyPerformanceModule } from './containers/my-performance/my-performance.module';
import { NotificationsComponent } from './shared/components/Notifications/notifications.component';
import { rootReducer } from './state/reducers/root.reducer';
import { SettingsComponent } from './shared/components/settings/settings.component';
import { TimeAgoPipe } from './pipes/timeAgo.pipe';
import { UtilService } from './services/util.service';

export const AppUpgradeAdapter = new UpgradeAdapter(forwardRef(() => AppModule)); // tslint:disable-line:variable-name no-use-before-declare

// make ng1 components available to ng2 code & templates (these are passed as declarations)
const UpgradedComponents = [  // tslint:disable-line:variable-name
  AppUpgradeAdapter.upgradeNg1Component('navbar'),
  AppUpgradeAdapter.upgradeNg1Component('appView')
];

// make ng1 services available to ng2 code (these are NOT passed as providers)
AppUpgradeAdapter.upgradeNg1Provider('userService');
AppUpgradeAdapter.upgradeNg1Provider('versionService');
AppUpgradeAdapter.upgradeNg1Provider('$state');

@NgModule({
  imports: [
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    BrowserModule,
    EffectsModule,
    HttpModule,
    MyPerformanceModule,
    RouterModule.forRoot([ {path: 'placeholder', redirectTo: '/'} ]), // need ng2 router for angulartics2 to work
    StoreModule.provideStore(rootReducer)
  ],
  declarations: [
    AppComponent,
    DateRangeComponent,
    FormatOpportunitiesTypePipe,
    GreetingComponent,
    NotificationsComponent,
    SettingsComponent,
    TimeAgoPipe,
    ...UpgradedComponents
  ],
  providers: [
    DateRangeApiService,
    DateRangeService,
    DateRangeTransformerService,
    ResponsibilitiesApiService,
    ResponsibilitiesTransformerService,
    UtilService
  ]
})
export class AppModule {
  constructor(angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    // Note: must keep angulartics2GoogleAnalytics constructor param so that it gets instantiated

    // disable automatic page view tracking
    angulartics2.virtualPageviews(false);
    angulartics2.firstPageview(false);
  }
}
