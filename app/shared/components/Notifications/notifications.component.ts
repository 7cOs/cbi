import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

import { Notification } from '../../../models/notification.model';

@Component({
  selector: 'notifications',
  template: require('./notifications.component.pug')
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
    this.allNotificationRead = this._notifications.filter(notification => notification.status !== 'READ').length < 1;
  }

  noNotifications: string = 'No unread notifications.';
  allNotificationRead: boolean = true;

  private _notifications: Notification[] = [];

  clickOn(notification: Notification) {
    this.onNotificationClicked.emit(notification);
  }

  notificationClasses(notification: Notification) {
    return {
      ['read']: notification.status === 'READ',
      [notification.action]: true
    };
  }

  notUnknown(value: string) {
    return value && value.toString().toUpperCase() !== 'UNKNOWN';
  }

  // override setter and orderBy: '-dateCreated'
}
