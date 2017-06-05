import * as moment from 'moment';

import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({name: 'timeAgo'})
export class TimeAgoPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(dateFrom: moment.Moment, type: DateType): string {
    const now = moment();
    let formattedDate = '';

    switch (type) {
      case 'daysOnly':
        const hoursAgo = Math.round((now.valueOf() - dateFrom.valueOf()) / (1000 * 60 * 60));

        if (hoursAgo < 2) formattedDate = hoursAgo + ' hour ago';
        else if (hoursAgo < 25) formattedDate = hoursAgo + ' hours ago';
        else if (hoursAgo > 24) formattedDate = Math.round(hoursAgo / 24) + ' days ago';
        break;
      case 'relative':
      case 'relativeTime':
      default:
        const daysAgo = (now.valueOf() - dateFrom.valueOf()) / (1000 * 60 * 60 * 24);

        if (daysAgo > 7) {
          formattedDate = type === 'relativeTime' ? this.datePipe.transform(now, 'MMMM d, y')
          + ' at ' + this.datePipe.transform(now, 'h:mm a') : this.datePipe.transform(now, 'longDate');
        } else if (daysAgo > 1) {
          formattedDate = Math.round(daysAgo) + ' days ago';
        } else if (daysAgo < 1 && (daysAgo * 24) > 1) {
          const hours = Math.round(daysAgo * 24);
          formattedDate = hours < 2 ? hours + ' hour ago' : hours + ' hours ago';
        } else { // 0-60 minutes
          const minutes = Math.round(daysAgo * 24 * 60);
          formattedDate = minutes < 2 ? minutes + ' minute ago' : minutes + ' minutes ago';
        }
        break;
    }

    return formattedDate;
  }
}

type DateType = 'daysOnly' | 'relative' | 'relativeTime';
