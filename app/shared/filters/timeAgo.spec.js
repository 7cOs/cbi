describe('Unit: timeAgo Filter', function() {
  var filter;

  beforeEach(function() {
    angular.mock.module('orion.common.filters');

    inject(function(_timeAgoFilter_) {
      filter = _timeAgoFilter_;
    });

  });

  it('should exist', function() {
    expect(filter).toBeDefined();
  });

  describe('type: daysOnly', function() {
    var sixHours, fiveDays, thirtyTwoDays, twoHundredDays, threeHundredSeventyDays;
    beforeEach(function() {
      sixHours = new Date();
      sixHours.setHours(sixHours.getHours() - 6);

      fiveDays = new Date();
      fiveDays.setDate(fiveDays.getDate() - 5);

      thirtyTwoDays = new Date();
      thirtyTwoDays.setDate(thirtyTwoDays.getDate() - 32);

      twoHundredDays = new Date();
      twoHundredDays.setDate(twoHundredDays.getDate() - 200);

      threeHundredSeventyDays = new Date();
      threeHundredSeventyDays.setDate(threeHundredSeventyDays.getDate() - 370);
    });

    it('should return hours if under one day', function() {
      expect(filter(sixHours, 'daysOnly')).toEqual('6 hours ago');
    });
    it('should return 5 days ago', function() {
      expect(filter(fiveDays, 'daysOnly')).toEqual('5 days ago');
    });
    it('should return 32 days ago', function() {
      expect(filter(thirtyTwoDays, 'daysOnly')).toEqual('32 days ago');
    });
    it('should return 200 days ago', function() {
      expect(filter(twoHundredDays, 'daysOnly')).toEqual('200 days ago');
    });
    it('should return 370 days ago', function() {
      expect(filter(threeHundredSeventyDays, 'daysOnly')).toEqual('370 days ago');
    });
  });

  describe('type: relative', function() {
    var oneMinute, twentyFourMinutes, oneHour, sixHours, twoDays, dateNoTime;
    beforeEach(function() {
      oneMinute = new Date();
      oneMinute.setMinutes(oneMinute.getMinutes() - 1);

      twentyFourMinutes = new Date();
      twentyFourMinutes.setMinutes(twentyFourMinutes.getMinutes() - 24);

      oneHour = new Date();
      oneHour.setMinutes(oneHour.getMinutes() - 61);

      sixHours = new Date();
      sixHours.setHours(sixHours.getHours() - 6);

      twoDays = new Date();
      twoDays.setDate(twoDays.getDate() - 2);

      dateNoTime = new Date(2015, 0, 1);
    });

    it('should return one minute ago', function() {
      expect(filter(oneMinute, 'relative')).toEqual('1 minute ago');
    });

    it('should return minutes ago', function() {
      expect(filter(twentyFourMinutes, 'relative')).toEqual('24 minutes ago');
    });

    it('should return 1 hour ago', function() {
      expect(filter(oneHour, 'relative')).toEqual('1 hour ago');
    });

    it('should return 6 hours ago', function() {
      expect(filter(sixHours, 'relative')).toEqual('6 hours ago');
    });

    it('should return 2 days ago', function() {
      expect(filter(twoDays, 'relative')).toEqual('2 days ago');
    });

    it('should return month day, year', function() {
      expect(filter(dateNoTime, 'relative')).toEqual('January 1, 2015');
    });

  });

  describe('type: relative with time', function() {
    var dateTime;
    beforeEach(function() {
      dateTime = new Date(2015, 0, 1, 9, 0);
    });

    it('should return month day, year at time', function() {
      expect(filter(dateTime, 'relativeTime')).toEqual('January 1, 2015 at 9:00 AM');
    });
  });

});
