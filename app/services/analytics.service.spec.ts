import * as Chance from 'chance';
import { fn as momentPrototype } from 'moment'; // http://dancork.co.uk/2015/12/07/stubbing-moment/
import { inject, TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { GoogleAnalyticsTrackerService } from './google-analytics-tracker.service';

const chance = new Chance();

describe('Service: AnalyticsService', () => {
  let mockTracker: any;
  let mockGoogleAnalyticsTrackerService: GoogleAnalyticsTrackerService;
  let mockStateService: any;
  let mockTransitionsService: any;
  let mockUserService: any;
  let mockFormattedMoment: string;

  let analyticsService: AnalyticsService;

  beforeEach(() => {
    mockFormattedMoment = chance.string();
    spyOn(momentPrototype, 'format').and.callFake((format: string) => {
      return format === 'YYYY-MM-DDTHH:mm:ss.SSSZ' ? mockFormattedMoment : '';
    });

    mockTracker = jasmine.createSpy('ga');
    mockGoogleAnalyticsTrackerService = {
      getTrackerInterface: jasmine.createSpy('getTrackerInterface').and.returnValue(mockTracker)
    };
    mockStateService = {
      current: {
        name: chance.string()
      },
      params: chance.string(),
      href: jasmine.createSpy('href')
    };
    mockTransitionsService = {
      onSuccess: jasmine.createSpy('onSuccess')
    };
    mockUserService = {
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
      { provide: GoogleAnalyticsTrackerService, useValue: mockGoogleAnalyticsTrackerService },
      { provide: '$state', useValue: mockStateService },
      { provide: '$transitions', useValue: mockTransitionsService },
      { provide: 'userService', useValue: mockUserService }
    ]
  }));

  beforeEach(inject([ AnalyticsService ], (_analyticsService: AnalyticsService) => {
    analyticsService = _analyticsService;
  }));

  describe('constructor', () => {
    it('should get tracker interface', () => {
      expect(mockGoogleAnalyticsTrackerService.getTrackerInterface).toHaveBeenCalled();
    });
  });

  describe('initializeAnalytics', () => {
    beforeEach(() => {
      analyticsService.initializeAnalytics();
    });

    it('should execute 2 tracker commands', () => {
      expect(mockTracker.calls.count()).toBe(2);
    });

    it('should create tracker with the correct ID values', () => {
      expect(mockTracker.calls.argsFor(0)).toEqual([
        'create',
        mockUserService.model.currentUser.analytics.trackerId,
        'auto',
        { userId: mockUserService.model.currentUser.employeeID }
      ]);
    });

    it('should set session-level custom dimensions', () => {
      expect(mockTracker.calls.argsFor(1)).toEqual([
        'set',
        {
          dimension1: 'Constellation Brands',
          dimension2: mockUserService.model.currentUser.sfdcUserInfo.CompanyName,
          dimension3: mockUserService.model.currentUser.sfdcUserInfo.Division,
          dimension4: mockUserService.model.currentUser.sfdcUserInfo.Role__c,
          dimension5: mockUserService.model.currentUser.sfdcUserInfo.Supervisory__c,
          dimension6: mockUserService.model.currentUser.sfdcUserInfo.CBI_Department__c,
          dimension7: mockUserService.model.currentUser.employeeID,
          dimension9: mockUserService.model.currentUser.analytics.sessionId
        }
      ]);
    });
  });

  describe('trackStateTransitions', () => {
    let mockUrl: string;
    let mockLocation: string;

    beforeEach(() => {
      mockUrl = chance.string();
      mockLocation = chance.string();
      mockStateService.href.and.callFake((name: string, params: string, props: any) => {
        if (name === mockStateService.current.name && params === mockStateService.params) {
          return props && props.absolute === true ? mockLocation : mockUrl;
        }
      });

      analyticsService.initializeAnalytics();
    });

    it('should register onSuccess  handler for all transitions ({}) in initializeAnalytics', () => {
      expect(mockTransitionsService.onSuccess.calls.count()).toBe(1);
      expect(mockTransitionsService.onSuccess.calls.first().args[0]).toEqual({});
    });

    describe('state transition with no overrides', () => {
      let transitonHandler: any;
      let mockState: any;
      let mockTransition: any;

      beforeEach(() => {
        spyOn(analyticsService, 'trackPageView');
        mockState = {
          title: chance.string()
        };
        mockTransition = {
          to: () => mockState
        };

        transitonHandler = mockTransitionsService.onSuccess.calls.first().args[1];
        transitonHandler(mockTransition);
      });

      it('should track page view with url, title, and location for current state', () => {
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(mockUrl, mockState.title, mockLocation);
      });

      it('should set tracker properties so page variables are included in future events', () => {
        expect(mockTracker.calls.count()).toBe(3);
        expect(mockTracker.calls.argsFor(2)).toEqual([
          'set',
          {
            location: mockLocation,
            page: mockUrl,
            title: mockState.title
          }
        ]);
      });
    });

    describe('state transition with analyticsData overrides', () => {
      let transitonHandler: any;
      let mockState: any;
      let mockTransition: any;

      beforeEach(() => {
        spyOn(analyticsService, 'trackPageView');
        mockState = {
          title: chance.string(),
          analyticsData: {
            pageTitle: chance.string(),
            pageUrl: chance.string()
          }
        };
        mockTransition = {
          to: () => mockState
        };

        transitonHandler = mockTransitionsService.onSuccess.calls.first().args[1];
        transitonHandler(mockTransition);
      });

      it('should track page view with location and overridden url and title for current state', () => {
        expect(analyticsService.trackPageView).toHaveBeenCalledWith(
          mockState.analyticsData.pageUrl,
          mockState.analyticsData.pageTitle,
          mockLocation);
      });

      it('should set tracker properties with overridden values so page variables are included in future events', () => {
        expect(mockTracker.calls.count()).toBe(3);
        expect(mockTracker.calls.argsFor(2)).toEqual([
          'set',
          {
            location: mockLocation,
            page: mockState.analyticsData.pageUrl,
            title: mockState.analyticsData.pageTitle
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
      expect(mockTracker).toHaveBeenCalledWith('send', 'pageview', testUrl, {
        location: testLocation,
        title: testTitle,
        dimension8: mockFormattedMoment
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
      expect(mockTracker).toHaveBeenCalledWith('send', 'event', testCategory, testAction, testLabel, {
        dimension8: mockFormattedMoment,
        dimension11: `${testCategory}/${testAction}/${testLabel}`
      });
    });
  });
});
