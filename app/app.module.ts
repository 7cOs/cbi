import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, forwardRef } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { UpgradeAdapter } from '@angular/upgrade';

import { AnalyticsEventDirective } from './directives/analytics-event.directive';
import { AnalyticsService } from './services/analytics.service';
import { AppComponent } from './shared/containers/app/app.component';
import { DateRangeApiService } from './services/date-range-api.service';
import { DateRangeComponent } from './shared/components/date-ranges/date-ranges.component';
import { DateRangeService } from './services/date-range.service';
import { DateRangeTransformerService } from './services/date-range-transformer.service';
import { EffectsModule } from './state/effects/effects.module';
import { FormatOpportunitiesTypePipe } from './pipes/formatOpportunitiesType.pipe';
import { GoogleAnalyticsTrackerService } from './services/google-analytics-tracker.service';
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
  AppUpgradeAdapter.upgradeNg1Component('appView'),
  AppUpgradeAdapter.upgradeNg1Component('navbar')
];

// make ng1 services available to ng2 code (these are NOT passed as providers)
AppUpgradeAdapter.upgradeNg1Provider('$state');
AppUpgradeAdapter.upgradeNg1Provider('$transitions');
AppUpgradeAdapter.upgradeNg1Provider('toastService');
AppUpgradeAdapter.upgradeNg1Provider('userService');
AppUpgradeAdapter.upgradeNg1Provider('versionService');
AppUpgradeAdapter.upgradeNg1Provider('ieHackService');

@NgModule({
  imports: [
    BrowserModule,
    EffectsModule,
    HttpModule,
    MyPerformanceModule,
    StoreModule.provideStore(rootReducer)
  ],
  declarations: [
    AnalyticsEventDirective,
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
    AnalyticsService,
    DateRangeApiService,
    DateRangeService,
    DateRangeTransformerService,
    GoogleAnalyticsTrackerService,
    UtilService
  ]
})
export class AppModule {
  constructor(analyticsService: AnalyticsService) {
    analyticsService.initializeAnalytics();
  }
}
