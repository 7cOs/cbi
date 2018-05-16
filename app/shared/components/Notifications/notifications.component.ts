import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

import { AnalyticsService } from '../../../services/analytics.service';
import { Notification } from '../../../models/notification.model';
import { NotificationStatus } from '../../../enums/notification.enum';

@Component({
  selector: 'notifications',
  template: require('./notifications.component.pug'),
  styles: [ require('./notifications.component.scss') ]
})

export class NotificationsComponent {
  @Output() onNotificationClicked = new EventEmitter<Notification>();

  @Input()
  set notifications(notifications: Notification[]) {
    // Temporary: creating moments from strings
    this._notifications = notifications.map(notification => {
      notification.dateCreated = moment(notification.dateCreated);
      notification.dateUpdated = moment(notification.dateUpdated);

      return notification;
    });

    this._notifications = this._notifications.sort((n1, n2) => n2.dateCreated.diff(n1.dateCreated));
    this.allNotificationRead = this._notifications.filter(notification => notification.status !== NotificationStatus.READ).length < 1;
  }

  private allNotificationRead: boolean = true;
  private _notifications: Notification[] = [];
  private notificationActionAnalyticsMapping = {
    'TARGET_LIST': 'Read Target List Notifications',
    'OPPORTUNITY': 'Read Opportunity Notifications',
    'ACCOUNT': 'Read Note Notifications',
    'STORE': 'Read Note Notifications',
    'DISTRIBUTOR': 'Read Note Notifications',
    'LIST': 'Read List Notifications'
  };

  constructor(
    private analyticsService: AnalyticsService
  ) { }

  clickOn(notification: Notification) {
    const analyticsAction = this.notificationActionAnalyticsMapping[notification.objectType];
    let analyticsLabel;
    if (notification.objectType === 'STORE'
      || notification.objectType === 'ACCOUNT'
      || notification.objectType === 'DISTRIBUTOR') {
      analyticsLabel = notification.salesforceUserNoteID ? notification.salesforceUserNoteID : 'Not Available';
    } else {
      analyticsLabel = notification.objectId ? notification.objectId : 'Not Available';
    }
    this.analyticsService.trackEvent(
      'Navigation',
      analyticsAction,
      analyticsLabel
    );

    this.onNotificationClicked.emit(notification);
  }

  notificationClasses(notification: Notification) {
    return {
      ['read']: notification.status === NotificationStatus.READ,
      [notification.action]: true
    };
  }

  notUnknown(value: string) {
    return value && value.toString().toUpperCase() !== 'UNKNOWN';
  }
}
