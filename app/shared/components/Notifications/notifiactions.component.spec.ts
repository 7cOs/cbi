import { Angulartics2 } from 'angulartics2';
import { inject, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import { Notification } from './../../../models/notification.model';
import {
  targetListNotificationNotificationMock,
  opportunityNotificationMock,
  storeNotificationMock,
  accountNotificationMock
} from '../../../models/notification.model.mock';

describe('NotificationsComponent', () => {

  beforeEach(() => {
    const mockAngulartics2 = jasmine.createSpyObj('angulartics2', ['eventTrack']);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', ['next']);
    TestBed.configureTestingModule({
      providers: [
        NotificationsComponent,
        {
          provide: Angulartics2,
          useValue: mockAngulartics2
        }
      ]
    });
  });

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
        targetListNotificationNotificationMock(),
        opportunityNotificationMock()
      ];

      component.notifications = notificationsMock;

      expect(component.allNotificationRead).toEqual(false);
    }));

    it('should determine that all notifications not',
      inject([ NotificationsComponent ], (component: NotificationsComponent) => {

      const notificationsMock = [
        storeNotificationMock(),
        accountNotificationMock()
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
