import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'notifications',
  template: require('./notifications.component.pug')
})

export class NotificationsComponent {
  @Input()
  set notifications(notifications: [Notification]) {
    this._notifications = notifications;
    this.allNotificationRead = notifications.filter(notification => notification.status !== 'READ').length < 1;
  };

  @Output() notificationClicked = new EventEmitter<Notification>();

  noNotifications: string = 'No unread notifications.';
  allNotificationRead: boolean = true;

  private _notifications = [];

  clickOn(notification: Notification) {
    this.notificationClicked.emit(notification);
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
