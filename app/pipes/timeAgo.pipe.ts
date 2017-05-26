import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({name: 'timeAgo'})
export class TimeAgoPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(displayDate: string, type: DateType): string {
    const currentDate = new Date();
    const d = new Date(displayDate);
    let returnStr = '';

    // if (isNaN(Date.parse(d))) return '';

    if (type === 'daysOnly') {
      const hoursPast = Math.round((currentDate.getTime() - d.getTime()) / (1000 * 60 * 60));

      if (hoursPast < 2) returnStr = hoursPast + ' hour ago';
      else if (hoursPast < 25) returnStr = hoursPast + ' hours ago';
      else if (hoursPast > 24) returnStr = Math.round(hoursPast / 24) + ' days ago';

    } else if (type === 'relative' || type === 'relativeTime') {
      const daysAgo = (currentDate.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);

      if (daysAgo > 7) { // 7+ days
        returnStr = type === 'relativeTime' ? this.datePipe.transform(d, 'MMMM d, y')
        + ' at ' + this.datePipe.transform(d, 'h:mm a') : this.datePipe.transform(d, 'longDate');
      } else if (daysAgo > 1) { // 1 - 7 days
        returnStr = Math.round(daysAgo) + ' days ago';
      } else if (daysAgo < 1 && (daysAgo * 24) > 1) { // 61 minutes to 24 hours
        const hours = Math.round(daysAgo * 24);
        returnStr = hours < 2 ? hours + ' hour ago' : hours + ' hours ago';
      } else { // 0-60 minutes
        const minutes = Math.round(daysAgo * 24 * 60);
        returnStr = minutes < 2 ? minutes + ' minute ago' : minutes + ' minutes ago';
      }
    }

    return returnStr;
  }
}

type DateType = 'daysOnly' | 'relative' | 'relativeTime';
