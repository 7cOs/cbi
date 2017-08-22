import { Inject, Injectable } from '@angular/core';
import * as moment from 'moment';

import { GoogleAnalyticsTrackerService } from './google-analytics-tracker.service';

@Injectable()
export class AnalyticsService {
  private gaTracker: UniversalAnalytics.ga;

  constructor(
    gaTrackerService: GoogleAnalyticsTrackerService,
    @Inject('$state') private $state: any,
    @Inject('$transitions') private $transitions: any,
    @Inject('userService') private userService: any
  ) {
    this.gaTracker = gaTrackerService.getTrackerInterface();
  }

  initializeAnalytics() {
    const currentUser = this.userService.model.currentUser;
    this.createTracker(currentUser.analytics.trackerId, currentUser.employeeID);
    this.setSessionDimensions();
    this.trackStateTransitions();
  }

  trackPageView(url: string, title: string, location: string) {
    const properties = Object.assign(this.buildHitDimensions(), {
      location: location,
      title: title
    });

    this.gaTracker('send', 'pageview', url, properties);
  }

  trackEvent(category: string, action: string, label: string) {
    const properties = this.buildHitDimensions(category, action, label);
    this.gaTracker('send', 'event', category, action, label, properties);
  }

  private buildHitDimensions(category?: string, action?: string, label?: string) {
    const hitDimensions = {
      dimension8: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    };

    if (category && action && label) {
      hitDimensions['dimension11'] = `${category}/${action}/${label}`;
    }

    return hitDimensions;
  }

  private trackStateTransitions() {
    this.$transitions.onSuccess({}, (transition: any) => {
      const toState = transition.to();
      const location = this.$state.href(this.$state.current.name, this.$state.params, {absolute: true});
      let url = this.$state.href(this.$state.current.name, this.$state.params);
      let title = toState.title;

      // override title/page url using state definition
      if (toState.analyticsData) {
        if (toState.analyticsData.pageTitle) {
          title = toState.analyticsData.pageTitle;
        }

        if (toState.analyticsData.pageUrl) {
          url = toState.analyticsData.pageUrl;
        }
      }

      this.trackPageView(url, title, location);

      // make sure subsequent events use page-specific info
      this.setTrackerProperties({
        location: location,
        page: url,
        title: title
      });
    });
  }

  private setSessionDimensions() {
    const sfdcUserInfo = this.userService.model.currentUser.sfdcUserInfo;
    this.setTrackerProperties({
      dimension1: 'Constellation Brands',                                 // 'User Type', static
      dimension2: sfdcUserInfo.CompanyName,                               // 'Company'
      dimension3: sfdcUserInfo.Division,                                  // 'Division'
      dimension4: sfdcUserInfo.Role__c,                                   // 'Role'
      dimension5: sfdcUserInfo.Supervisory__c,                            // 'Supervisory'
      dimension6: sfdcUserInfo.CBI_Department__c,                         // 'Department'
      dimension7: this.userService.model.currentUser.employeeID,          // 'User Id'
      dimension9: this.userService.model.currentUser.analytics.sessionId, // 'SessionId'
    });
  }

  private createTracker(trackerId: string, userId: string) {
    this.gaTracker('create', trackerId, 'auto', {
      userId: userId || 'undefined'
    });
  }

  private setTrackerProperties(properties: any) {
    this.gaTracker('set', properties);
  }
}
