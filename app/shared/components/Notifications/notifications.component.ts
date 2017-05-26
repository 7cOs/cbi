import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'notifications',
  template: require('./notifications.component.pug')
})

export class NotificationsComponent implements OnChanges {
  @Input() notifications: [Notification];

  noNotifications: string = 'No unread notifications.';

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    debugger;
  }

  markRead(notification: Notification) {
    console.warn(notification);
  }

  // override setter and orderBy: '-dateCreated'
}
