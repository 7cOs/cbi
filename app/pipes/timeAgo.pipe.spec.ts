import * as moment from 'moment';

import { TimeAgoPipe } from './timeAgo.pipe';

describe('Pipe: TimeAgoPipe', () => {
  let pipe: TimeAgoPipe = new TimeAgoPipe();

  it('should give an empty string for a null or undefined moment', () => {
    expect(pipe.transform(null, 'daysOnly')).toEqual('');
    expect(pipe.transform(undefined, 'daysOnly')).toEqual('');

    expect(pipe.transform(null, 'relative')).toEqual('');
    expect(pipe.transform(undefined, 'relative')).toEqual('');
  });

  describe('daysOnly type', () => {

    it('should format the date correctly', () => {
      const oneHourAgo = moment().subtract(1, 'hours');
      expect(pipe.transform(oneHourAgo, 'daysOnly')).toEqual('1 hour ago');

      const twoHoursAgo = moment().subtract(23, 'hours');
      expect(pipe.transform(twoHoursAgo, 'daysOnly')).toEqual('23 hours ago');

      const oneDayAgo = moment().subtract(24, 'hours');
      expect(pipe.transform(oneDayAgo, 'daysOnly')).toEqual('1 day ago');

      const twoDaysAgo = moment().subtract(48, 'hours');
      expect(pipe.transform(twoDaysAgo, 'daysOnly')).toEqual('2 days ago');
    });

  });

  describe('relative type', () => {

    it('should format the date correctly', () => {
      const eightDaysAgo = moment('1989-01-23T17:02:27.3Z').subtract(8, 'days');
      expect(pipe.transform(eightDaysAgo, 'relative')).toEqual('January 15, 1989');

      const twoDaysAgo = moment().subtract(2, 'days');
      expect(pipe.transform(twoDaysAgo, 'relative')).toEqual('2 days ago');

      const oneDayAgo = moment().subtract(1, 'days');
      expect(pipe.transform(oneDayAgo, 'relative')).toEqual('1 day ago');

      const twoHoursAgo = moment().subtract(2, 'hours');
      expect(pipe.transform(twoHoursAgo, 'relative')).toEqual('2 hours ago');

      const thirtyMinutesAgo = moment().subtract(30, 'minutes');
      expect(pipe.transform(thirtyMinutesAgo, 'relative')).toEqual('30 minutes ago');

      const oneMinuteAgo = moment().subtract(1, 'minutes');
      expect(pipe.transform(oneMinuteAgo, 'relative')).toEqual('1 minute ago');
    });

  });

});
