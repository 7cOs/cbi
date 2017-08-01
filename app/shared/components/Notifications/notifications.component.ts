import { Angulartics2 } from 'angulartics2';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

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
    'TARGET_LIST': 'Shared Target List',
    'OPPORTUNITY': 'Shared Opportunity',
    'ACCOUNT': 'Shared Note',
    'STORE': ''
  };

  constructor(
    private angulartics2: Angulartics2
  ) { }

  clickOn(notification: Notification) {
    const analyticsLabel = this.notificationActionAnalyticsMapping[notification.objectType];
    this.angulartics2.eventTrack.next({action: 'Read Notification', properties: {category: 'Notifications', label: analyticsLabel}});

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
