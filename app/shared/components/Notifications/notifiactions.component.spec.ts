import { Angulartics2 } from 'angulartics2';
import { By } from '@angular/platform-browser';
import { inject, TestBed, ComponentFixture } from '@angular/core/testing';
import * as moment from 'moment';

import { FormatOpportunitiesTypePipe } from '../../../pipes/formatOpportunitiesType.pipe';
import { TimeAgoPipe } from '../../../pipes/timeAgo.pipe';
import { NotificationsComponent } from './notifications.component';
import { Notification } from '../../../models/notification.model';
import {
  getTargetListNotificationNotificationMock,
  getOpportunityNotificationMock,
  getStoreNotificationMock,
  getAccountNotificationMock
} from '../../../models/notification.model.mock';

describe('NotificationsComponent', () => {

  let fixture: ComponentFixture<NotificationsComponent>;
  let componentInstance: NotificationsComponent;

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
    componentInstance = fixture.componentInstance;
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
        getTargetListNotificationNotificationMock(),
        getOpportunityNotificationMock()
      ];

      componentInstance.notifications = notificationsMock;

      fixture.detectChanges();
      const noUnreadNotificationElement = fixture.debugElement
        .query(By.css('.notification-card.clearfix:last-child .details p')).nativeElement;
      expect(noUnreadNotificationElement.textContent).not.toContain('No unread notifications.');
    });

    it('should determine that all notifications are read', () => {
      const notificationsMock = [
        getStoreNotificationMock(),
        getAccountNotificationMock()
      ];

      notificationsMock[0].status = 'READ';
      notificationsMock[1].status = 'READ';

      componentInstance.notifications = notificationsMock;

      fixture.detectChanges();
      const noUnreadNotificationElement = fixture.debugElement
        .query(By.css('.notification-card.clearfix:last-child .details p')).nativeElement;
      expect(noUnreadNotificationElement.textContent).toBe('No unread notifications.');
    });

    it('should sort the notifications by dateCreated descending', () => {
      const notificationsMock = [
        getStoreNotificationMock(),
        getAccountNotificationMock()
      ];

      notificationsMock[0].dateCreated = moment().subtract(2, 'days');
      notificationsMock[1].dateCreated = moment().subtract(1, 'days');

      componentInstance.notifications = notificationsMock;

      fixture.detectChanges();
      const firstCreatorLabel = fixture.debugElement
        .query(By.css('.notification-card.clearfix:first-child .info label:last-child')).nativeElement;
      const secondCreatorLabel = fixture.debugElement
        .query(By.css('.notification-card.clearfix:nth-child(2) .info label:last-child')).nativeElement;

      expect(firstCreatorLabel.textContent)
        .toBe(`by ${notificationsMock[1].creator.firstName} ${notificationsMock[1].creator.lastName}`);
      expect(secondCreatorLabel.textContent)
        .toBe(`by ${notificationsMock[0].creator.firstName} ${notificationsMock[0].creator.lastName}`);
    });

  });

  describe('onNotificationClicked', () => {

    it('should catch a click on a notification',
      inject([ NotificationsComponent ], (component: NotificationsComponent) => {

      const notificationsMock = [
        getOpportunityNotificationMock(),
        getOpportunityNotificationMock()
      ];

      component.onNotificationClicked.subscribe((notification: Notification) => {
        expect(notification).toBe(notificationsMock[0]);
      });

      component.notifications = notificationsMock;
      component.clickOn(notificationsMock[0]);
    }));

  });

});
