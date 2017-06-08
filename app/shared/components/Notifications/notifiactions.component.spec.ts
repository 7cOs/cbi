import { Angulartics2 } from 'angulartics2';
import { By } from '@angular/platform-browser';
import { inject, TestBed, ComponentFixture } from '@angular/core/testing';

import { FormatOpportunitiesTypePipe } from '../../../pipes/formatOpportunitiesType.pipe';
import { TimeAgoPipe } from '../../../pipes/timeAgo.pipe';
import { NotificationsComponent } from './notifications.component';
import { Notification } from '../../../models/notification.model';
import {
  targetListNotificationNotificationMock,
  opportunityNotificationMock,
  storeNotificationMock,
  accountNotificationMock
} from '../../../models/notification.model.mock';

describe('NotificationsComponent', () => {

  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(() => {
    const mockAngulartics2 = jasmine.createSpyObj('angulartics2', ['eventTrack']);
    mockAngulartics2.eventTrack = jasmine.createSpyObj('angulartics2', ['next']);

    TestBed.configureTestingModule({
      declarations: [
        NotificationsComponent,
        FormatOpportunitiesTypePipe,
        TimeAgoPipe
      ],
      providers: [
        NotificationsComponent,
        {
          provide: Angulartics2,
          useValue: mockAngulartics2
        }
      ]
    });

    fixture = TestBed.createComponent(NotificationsComponent);
  });

  describe('constructor', () => {

    it('should be defaulted', () => {
      fixture.detectChanges();
      const noUnreadNotificationElement = fixture.debugElement
        .query(By.css('.notification-card.clearfix:last-child .details p')).nativeElement;
      expect(noUnreadNotificationElement.textContent).toBe('No unread notifications.');
    });

  });

  describe('setNotifications', () => {

    it('should determine that all notifications are not read', () => {
      const notificationsMock = [
        targetListNotificationNotificationMock(),
        opportunityNotificationMock()
      ];

      fixture.componentInstance.notifications = notificationsMock;

      fixture.detectChanges();
      const noUnreadNotificationElement = fixture.debugElement
        .query(By.css('.notification-card.clearfix:last-child .details p')).nativeElement;
      expect(noUnreadNotificationElement.textContent).not.toContain('No unread notifications.');
    });

    it('should determine that all notifications are read', () => {
      const notificationsMock = [
        storeNotificationMock(),
        accountNotificationMock()
      ];

      notificationsMock[0].status = 'READ';
      notificationsMock[1].status = 'READ';

      fixture.componentInstance.notifications = notificationsMock;

      fixture.detectChanges();
      const noUnreadNotificationElement = fixture.debugElement
        .query(By.css('.notification-card.clearfix:last-child .details p')).nativeElement;
      expect(noUnreadNotificationElement.textContent).toBe('No unread notifications.');
    });

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
