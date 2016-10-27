describe('[Services.chipsService]', function() {
  var chipsService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('cf.common.services');

    inject(function(_chipsService_) {
      chipsService = _chipsService_;
    });
  });

  var testServiceModelShort = [
    {
      'name': 'My Accounts Only'
    }
  ];

  var testServiceModelZero = [];

  var testServiceModelLong = [
    {
      'name': 'My Accounts Only'
    },
    {
      'name': 'Off-Premise'
    },
    {
      'name': 'Authorized'
    },
    {
      'name': 'All Types'
    },
    {
      'name': 'restaurant'
    }
  ];

  var testServiceModel = [
    {
      'name': 'My Accounts Only'
    },
    {
      'name': 'Off-Premise'
    },
    {
      'name': 'Authorized'
    },
    {
      'name': 'All Types'
    }
  ];

  var shuffledServiceModel = [
    {
      'name': 'Off-Premise'
    },
    {
      'name': 'All Types'
    },
    {
      'name': 'My Accounts Only'
    },
    {
      'name': 'Authorized'
    }
  ];

  it('should exist', function() {
    expect(chipsService).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(chipsService.isDefault).toBeDefined();
  });

  it('should reject a model that does not have 4 chips', function() {
    expect(chipsService.isDefault(testServiceModelShort)).toEqual(false);
    expect(chipsService.isDefault(testServiceModelLong)).toEqual(false);
    expect(chipsService.isDefault(testServiceModelZero)).toEqual(false);

  });

  it('should accept a model with the default order of chips', function() {
    expect(chipsService.isDefault(testServiceModel)).toEqual(true);
  });

  it('should accept a model with a shuffled order of chips', function() {
    expect(chipsService.isDefault(shuffledServiceModel)).toEqual(true);
  });
});
