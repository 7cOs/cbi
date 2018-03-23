import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, forwardRef } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { UpgradeAdapter } from '@angular/upgrade';

import { AnalyticsEventDirective } from './directives/analytics-event.directive';
import { AnalyticsService } from './services/analytics.service';
import { AppComponent } from './shared/containers/app/app.component';
import { CalculatorService } from './services/calculator.service';
import { DateRangeApiService } from './services/api/v3/date-range-api.service';
import { DateRangeComponent } from './shared/components/date-ranges/date-ranges.component';
import { DateRangeService } from './services/date-range.service';
import { DateRangeTransformerService } from './services/date-range-transformer.service';
import { effects } from './state/effects/root.effect';
import { Environment } from './environment';
import { FormatOpportunitiesTypePipe } from './pipes/formatOpportunitiesType.pipe';
import { GoogleAnalyticsTrackerService } from './services/google-analytics-tracker.service';
import { GreetingComponent } from './shared/components/greeting/greeting.component';
import { ListDetailModule } from './containers/lists/list-detail.module';
import { MyPerformanceModule } from './containers/my-performance/my-performance.module';
import { NotificationsComponent } from './shared/components/Notifications/notifications.component';
import { OpportunitiesSearchHandoffService } from './services/opportunities-search-handoff.service';
import { reducers, metaReducers } from './state/reducers/root.reducer';
import { SettingsComponent } from './shared/components/settings/settings.component';
import { SharedModule } from './shared/shared.module';
import { TimeAgoPipe } from './pipes/timeAgo.pipe';

export const AppUpgradeAdapter = new UpgradeAdapter(forwardRef(() => AppModule)); // tslint:disable-line:variable-name no-use-before-declare

// make ng1 components available to ng2 code & templates (these are passed as declarations)
const UpgradedComponents = [  // tslint:disable-line:variable-name
  AppUpgradeAdapter.upgradeNg1Component('appView'),
  AppUpgradeAdapter.upgradeNg1Component('navbar')
];

// make ng1 services available to ng2 code (these are NOT passed as providers)
AppUpgradeAdapter.upgradeNg1Provider('$state');
AppUpgradeAdapter.upgradeNg1Provider('$transitions');
AppUpgradeAdapter.upgradeNg1Provider('chipsService');
AppUpgradeAdapter.upgradeNg1Provider('filtersService');
AppUpgradeAdapter.upgradeNg1Provider('ieHackService');
AppUpgradeAdapter.upgradeNg1Provider('toastService');
AppUpgradeAdapter.upgradeNg1Provider('userService');
AppUpgradeAdapter.upgradeNg1Provider('versionService');

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ListDetailModule,
    MyPerformanceModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    Environment.isLocal() ? StoreDevtoolsModule.instrument({maxAge: 25}) : [],
    SharedModule
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
    CalculatorService,
    DateRangeApiService,
    DateRangeService,
    DateRangeTransformerService,
    GoogleAnalyticsTrackerService,
    OpportunitiesSearchHandoffService
  ]
})
export class AppModule {
  constructor(analyticsService: AnalyticsService) {
    analyticsService.initializeAnalytics();
  }
}
