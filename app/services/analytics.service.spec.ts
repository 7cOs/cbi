import * as Chance from 'chance';
import { fn as momentPrototype } from 'moment';
import { inject, TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { GoogleAnalyticsTrackerService } from './google-analytics-tracker.service';

const chance = new Chance();

describe('Service: AnalyticsService', () => {
  let trackerMock: any;
  let googleAnalyticsTrackerServiceMock: GoogleAnalyticsTrackerService;
  let stateServiceMock: any;
  let transitionsServiceMock: any;
  let userServiceMock: any;
  let formattedMomentMock: string;

  let analyticsService: AnalyticsService;

  beforeEach(() => {
    formattedMomentMock = chance.string();
    spyOn(momentPrototype, 'format').and.callFake((format: string) => {
      return format === 'YYYY-MM-DDTHH:mm:ss.SSSZ' ? formattedMomentMock : '';
    });

    trackerMock = jasmine.createSpy('ga');
    googleAnalyticsTrackerServiceMock = {
      getTrackerInterface: jasmine.createSpy('getTrackerInterface').and.returnValue(trackerMock)
    };
    stateServiceMock = {
      current: {
        name: chance.string()
      },
      params: chance.string(),
      href: jasmine.createSpy('href')
    };
    transitionsServiceMock = {
      onSuccess: jasmine.createSpy('onSuccess')
    };
    userServiceMock = {
      model: {
        currentUser: {
          employeeID: chance.string(),
          analytics: {
            trackerId: chance.string(),
            sessionId: chance.string()
          },
          sfdcUserInfo: {
            'CompanyName': chance.string(),
            'Division': chance.string(),
            'Role__c': chance.string(),
            'Supervisory__c': chance.string(),
            'CBI_Department__c': chance.string()
          }
        }
      }
    };
  });

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AnalyticsService,
      { provide: GoogleAnalyticsTrackerService, useValue: googleAnalyticsTrackerServiceMock },
      { provide: '$state', useValue: stateServiceMock },
      { provide: '$transitions', useValue: transitionsServiceMock },
      { provide: 'userService', useValue: userServiceMock }
    ]
  }));

  beforeEach(inject([ AnalyticsService ], (_analyticsService: AnalyticsService) => {
    analyticsService = _analyticsService;
  }));

  describe('constructor', () => {
    it('should get tracker interface', () => {
      expect(googleAnalyticsTrackerServiceMock.getTrackerInterface).toHaveBeenCalled();
    });
  });

  describe('initializeAnalytics', () => {
    beforeEach(() => {
      analyticsService.initializeAnalytics();
    });

    it('should execute 2 tracker commands', () => {
      expect(trackerMock.calls.count()).toBe(2);
    });

    it('should create tracker with the correct ID values', () => {
      expect(trackerMock.calls.argsFor(0)).toEqual([
        'create',
        userServiceMock.model.currentUser.analytics.trackerId,
        'auto',
        { userId: userServiceMock.model.currentUser.employeeID }
      ]);
    });

    it('should set session-level custom dimensions', () => {
      expect(trackerMock.calls.argsFor(1)).toEqual([
        'set',
        {
          dimension1: 'Constellation Brands',
          dimension2: userServiceMock.model.currentUser.sfdcUserInfo.CompanyName,
          dimension3: userServiceMock.model.currentUser.sfdcUserInfo.Division,
          dimension4: userServiceMock.model.currentUser.sfdcUserInfo.Role__c,
          dimension5: userServiceMock.model.currentUser.sfdcUserInfo.Supervisory__c,
          dimension6: userServiceMock.model.currentUser.sfdcUserInfo.CBI_Department__c,
          dimension7: userServiceMock.model.currentUser.employeeID,
          dimension9: userServiceMock.model.currentUser.analytics.sessionId
        }
      ]);
    });
  });

  describe('trackStateTransitions', () => {
    let urlMock: string;
    let locationMock: string;

    beforeEach(() => {
      urlMock = chance.string();
      locationMock = chance.string();
      stateServiceMock.href.and.callFake((name: string, params: string, props: any) => {
        if (name === stateServiceMock.current.name && params === stateServiceMock.params) {
          return props && props.absolute === true ? locationMock : urlMock;
        }
      });

      analyticsService.initializeAnalytics();
    });

    it('should register onSuccess  handler for all transitions ({}) in initializeAnalytics', () => {
      expect(transitionsServiceMock.onSuccess.calls.count()).toBe(1);
      expect(transitionsServiceMock.onSuccess.calls.first().args[0]).toEqual({});
    });

    describe('state transition with no overrides', () => {
      let transitonHandler: any;
      let stateMock: any;
      let transitionMock: any;

      beforeEach(() => {
        spyOn(analyticsService, 'trackPageView');
        stateMock = {
          title: chance.string()
        };
        transitionMock = {
          to: () => stateMock
        };

        transitonHandler = transitionsServiceMock.onSuccess.calls.first().args[1];
        transitonHandler(transitionMock);
      });

      it('should track page view with url, title, and location for current state', () => {
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(urlMock, stateMock.title, locationMock);
      });

      it('should set tracker properties so page variables are included in future events', () => {
        expect(trackerMock.calls.count()).toBe(3);
        expect(trackerMock.calls.argsFor(2)).toEqual([
          'set',
          {
            location: locationMock,
            page: urlMock,
            title: stateMock.title
          }
        ]);
      });
    });

    describe('state transition with analyticsData overrides', () => {
      let transitonHandler: any;
      let stateMock: any;
      let transitionMock: any;

      beforeEach(() => {
        spyOn(analyticsService, 'trackPageView');
        stateMock = {
          title: chance.string(),
          analyticsData: {
            pageTitle: chance.string(),
            pageUrl: chance.string()
          }
        };
        transitionMock = {
          to: () => stateMock
        };

        transitonHandler = transitionsServiceMock.onSuccess.calls.first().args[1];
        transitonHandler(transitionMock);
      });

      it('should track page view with location and overridden url and title for current state', () => {
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(
          stateMock.analyticsData.pageUrl,
          stateMock.analyticsData.pageTitle,
          locationMock);
      });

      it('should set tracker properties with overridden values so page variables are included in future events', () => {
        expect(trackerMock.calls.count()).toBe(3);
        expect(trackerMock.calls.argsFor(2)).toEqual([
          'set',
          {
            location: locationMock,
            page: stateMock.analyticsData.pageUrl,
            title: stateMock.analyticsData.pageTitle
          }
        ]);
      });
    });
  });

  describe('trackPageView', () => {
    let testUrl: string;
    let testTitle: string;
    let testLocation: string;

    beforeEach(() => {
      testUrl = chance.string();
      testTitle = chance.string();
      testLocation = chance.string();

      analyticsService.trackPageView(testUrl, testTitle, testLocation);
    });

    it('should send pageview with correct parameters', () => {
      expect(trackerMock).toHaveBeenCalledWith('send', 'pageview', testUrl, {
        location: testLocation,
        title: testTitle,
        dimension8: formattedMomentMock
      });
    });
  });

  describe('trackEvent', () => {
    let testCategory: string;
    let testAction: string;
    let testLabel: string;

    beforeEach(() => {
      testCategory = chance.string();
      testAction = chance.string();
      testLabel = chance.string();

      analyticsService.trackEvent(testCategory, testAction, testLabel);
    });

    it('should send event with correct parameters', () => {
      expect(trackerMock).toHaveBeenCalledWith('send', 'event', testCategory, testAction, testLabel, {
        dimension8: formattedMomentMock,
        dimension11: `${testCategory}/${testAction}/${testLabel}`
      });
    });
  });
});
