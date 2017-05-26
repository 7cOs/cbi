import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'notifications',
  template: require('./notifications.component.pug')
})

export class NotificationsComponent implements OnChanges {
  @Input()
  set notifications(notifications: [Notification]) {
    this._notifications = notifications;

    this.allNotificationRead = notifications.filter(notification => notification.status !== 'READ').length < 1;
  };

  noNotifications: string = 'No unread notifications.';
  allNotificationRead: boolean = false;

  private _notifications = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
  }

  markRead(notification: Notification) {
    console.warn(notification);
  }

  // override setter and orderBy: '-dateCreated'
}
