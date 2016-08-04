describe('Unit: timeAgo Filter', function() {
  var filter, yearsDown, yearsUp, months, days;

  beforeEach(function() {
    angular.mock.module('andromeda.common.filters');

    inject(function(_timeAgoFilter_) {
      filter = _timeAgoFilter_;
    });

    // create a dynamic dates so it wont error out every month
    yearsDown = new Date();
    yearsDown.setYear(yearsDown.getFullYear() - 10);

    yearsUp = new Date();
    yearsUp.setYear(yearsUp.getFullYear() - 10.7);

    months = new Date();
    months.setMonth(months.getMonth() - 3);

    days = new Date();
    days.setDate(days.getDate() - 7);
  });

  it('should exist', function() {
    expect(filter).toBeDefined();
  });

  it('should round to the nearest year if greater than one year ago', function() {
    expect(filter(yearsDown)).toEqual('10 years ago');
    expect(filter(yearsUp)).toEqual('11 years ago');
  });

  it('should only add an "s" if it is more than one month ago', function() {
    yearsDown.setYear(yearsDown.getFullYear() + 9);
    expect(filter(yearsDown)).toEqual('1 year ago');
  });

  it('should round to the nearest month if less than a year but more than 30 days', function() {
    expect(filter(months)).toEqual('3 months ago');
  });

  it('should only add an "s" if it is more than one month ago', function() {
    months.setMonth(months.getMonth() + 2);
    expect(filter(months)).toEqual('1 month ago');
  });

  it('should round to the nearest day if less than a month', function() {
    expect(filter(days)).toEqual('7 days ago');
  });

});
