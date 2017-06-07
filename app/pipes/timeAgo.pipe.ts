import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'timeAgo'})
export class TimeAgoPipe implements PipeTransform {

  transform(dateFrom: moment.Moment, type: DateType): string {
    if (dateFrom == null) {
      return '';
    }

    const now = moment();
    let formattedDate: string = '';

    switch (type) {
      case 'daysOnly':
        const hoursAgo = Math.round((now.valueOf() - dateFrom.valueOf()) / (1000 * 60 * 60));

        if (hoursAgo < 2) formattedDate = hoursAgo + ' hour ago';
        else if (hoursAgo < 24) formattedDate = hoursAgo + ' hours ago';
        else if (hoursAgo < 48) formattedDate = Math.round(hoursAgo / 24) + ' day ago';
        else formattedDate = Math.round(hoursAgo / 24) + ' days ago';
        break;
      case 'relative':
      default:
        const daysAgo = (now.valueOf() - dateFrom.valueOf()) / (1000 * 60 * 60 * 24);

        if (daysAgo > 7) {
          formattedDate = dateFrom.format('MMMM D, Y');
        } else if (Math.round(daysAgo) > 1) {
          formattedDate = Math.round(daysAgo) + ' days ago';
        } else if (Math.round(daysAgo) === 1) {
          formattedDate = Math.round(daysAgo) + ' day ago';
        } else if (daysAgo < 1 && (daysAgo * 24) > 1) {
          const hours = Math.round(daysAgo * 24);
          formattedDate = hours < 2 ? hours + ' hour ago' : hours + ' hours ago';
        } else {
          const minutes = Math.round(daysAgo * 24 * 60);
          formattedDate = minutes < 2 ? minutes + ' minute ago' : minutes + ' minutes ago';
        }
        break;
    }

    return formattedDate;
  }
}

type DateType = 'daysOnly' | 'relative';
