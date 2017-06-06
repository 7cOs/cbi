import { inject, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import { Notification } from './../../../models/notification.model';
import { opportunityNotificationMock } from '../../../models/notification.model.mock';

describe('NotificationsComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      NotificationsComponent
    ]
  }));

  describe('constructor', () => {

    it('should be defaulted',
      inject([ NotificationsComponent ], (component: NotificationsComponent) => {

      expect(component.noNotifications).toEqual('No unread notifications.');
      expect(component.allNotificationRead).toEqual(true);
    }));

  });

  describe('setNotifications', () => {

    it('should determine that all notifications are not read',
      inject([ NotificationsComponent ], (component: NotificationsComponent) => {

      const notificationsMock = [
        opportunityNotificationMock(),
        opportunityNotificationMock()
      ];

      component.notifications = notificationsMock;

      expect(component.allNotificationRead).toEqual(false);
    }));

    it('should determine that all notifications not',
      inject([ NotificationsComponent ], (component: NotificationsComponent) => {

      const notificationsMock = [
        opportunityNotificationMock(),
        opportunityNotificationMock()
      ];

      notificationsMock[0].status = 'READ';
      notificationsMock[1].status = 'READ';

      component.notifications = notificationsMock;

      expect(component.allNotificationRead).toEqual(true);
    }));

  });

  describe('onNotificationClicked', () => {

    it('should catch a click on a notification',
      inject([ NotificationsComponent ], (component: NotificationsComponent) => {

      const notificationsMock = [
        opportunityNotificationMock(),
        opportunityNotificationMock()
      ];

      component.onNotificationClicked.subscribe((notification: Notification) => {
        expect(notification).toBe(notificationsMock[0]);
      });

      component.notifications = notificationsMock;
      component.clickOn(notificationsMock[0]);
    }));

  });

});
