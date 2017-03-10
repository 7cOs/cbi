describe('Unit: inline search controller', function() {
  var scope, ctrl, searchService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.directives');

    inject(function($rootScope, $controller, _searchService_) {
      scope = $rootScope.$new();
      searchService = _searchService_;

      ctrl = $controller('InlineSearchController', {$scope: scope});
    });
  });

  it('should expose public methods', function() {
    expect(ctrl.action).not.toBeUndefined();
    expect(typeof (ctrl.action)).toEqual('function');

    expect(ctrl.resultChosen).not.toBeUndefined();
    expect(typeof (ctrl.resultChosen)).toEqual('function');

    expect(ctrl.clearModel).not.toBeUndefined();
    expect(typeof (ctrl.clearModel)).toEqual('function');

    expect(ctrl.close).not.toBeUndefined();
    expect(typeof (ctrl.close)).toEqual('function');

    expect(ctrl.onKeypress).not.toBeUndefined();
    expect(typeof (ctrl.onKeypress)).toEqual('function');

    expect(ctrl.userDataFormat).not.toBeUndefined();
    expect(typeof (ctrl.userDataFormat)).toEqual('function');

    expect(ctrl.inputFocused).not.toBeUndefined();
    expect(typeof (ctrl.inputFocused)).toEqual('function');
  });

  describe('[inlineSearch.action] method', function() {
    beforeEach(function() {
    });

    it('should error out if input is too short', function() {
      ctrl.input = '';
      expect(ctrl.input.length).toEqual(0);

      var result = ctrl.action('user');

      expect(ctrl.showLengthError).toEqual(true);
      expect(result).toEqual(undefined);
    });

    it('should reset stuff', function() {

      ctrl.input = 'testing';
      ctrl.action('user');

      expect(ctrl.results).toEqual([]);
      expect(ctrl.chosenResult).toEqual({});
      expect(ctrl.errorMessage).toEqual(null);
      expect(ctrl.loading).toEqual(true);
      expect(ctrl.showResults).toEqual(true);
      expect(ctrl.type).toEqual('user');
      expect(ctrl.showSearchIcon).toEqual(true);
    });

    it('should return for user', function() {
      spyOn(searchService, 'getUsers').and.callFake(function() {
        return {
          then: function(callback) { return callback([{value: 'test'}]); }
        };
      });
      ctrl.input = 'testing';
      ctrl.action('user');
      expect(ctrl.results).toEqual([{value: 'test'}]);
    });

    it('should return for product with variety == sku', function() {
      spyOn(searchService, 'getProducts').and.callFake(function() {
        return {
          then: function(callback) { return callback([{value: 'test'}]); }
        };
      });
      ctrl.variety = 'sku';

      ctrl.input = 'testing';
      ctrl.action('product');
      expect(ctrl.results).toEqual([{ value: 'test' }]);
    });

    it('should return for product with variety == package', function() {
      spyOn(searchService, 'getProducts').and.callFake(function() {
        return {
          then: function(callback) { return callback([{value: 'test'}]); }
        };
      });
      ctrl.variety = 'package';

      ctrl.input = 'testing';
      ctrl.action('product');
      expect(ctrl.results).toEqual([{ value: 'test' }]);
    });

    it('should return for product with variety == non-brand', function() {
      spyOn(searchService, 'getProducts').and.callFake(function() {
        return {
          then: function(callback) { return callback([{value: 'test'}]); }
        };
      });
      ctrl.variety = 'non-brand';

      ctrl.input = 'testing';
      ctrl.action('product');
      expect(ctrl.results).toEqual([{ value: 'test' }]);
    });
    it('should return for product with variety == undefined', function() {
      spyOn(searchService, 'getProducts').and.callFake(function() {
        return {
          then: function(callback) { return callback([{value: 'test'}]); }
        };
      });
      ctrl.input = 'testing';
      ctrl.action('product');
      expect(ctrl.results).toEqual([{ value: 'test' }]);
    });
    it('should return for store', function() {
      spyOn(searchService, 'getStores').and.callFake(function() {
        return {
          then: function(callback) { return callback([{ value: 'test', state: 'CA' }, { value: 'test', state: 'WA' }]); }
        };
      });

      ctrl.input = 'testing';
      ctrl.action('store');
      expect(ctrl.results).toEqual([[{ value: 'test', state: 'CA' }], [{ value: 'test', state: 'WA' }]]);
    });

    it('should return for distributor', function() {
      spyOn(searchService, 'getDistributors').and.callFake(function() {
        return {
          then: function(callback) { return callback([{value: 'test'}]); }
        };
      });
      ctrl.input = 'testing';
      ctrl.action('distributor');
      expect(ctrl.results).toEqual([{value: 'test'}]);
    });

    it('should return for chain', function() {
      spyOn(searchService, 'getChains').and.callFake(function() {
        return {
          then: function(callback) { return callback([{value: 'test'}]); }
        };
      });
      ctrl.input = 'testing';
      ctrl.action('chain');
      expect(ctrl.results).toEqual([{value: 'test'}]);
    });

    it('should return for location', function() {
      ctrl.input = 'testing';
      ctrl.action('location');
      expect(ctrl.results).toEqual([]);
    });

  });

  describe('[inlineSearch.clearModel] method', function() {
    beforeEach(function() {
    });

    it('should reset', function() {
      // mocking this because it is provided by the template
      ctrl.onRemove = function() {
        return;
      };
      ctrl.clearModel();

      expect(ctrl.chosenResult).toEqual(null);
      expect(ctrl.input).toEqual('');
      expect(ctrl.showX).toEqual(false);
    });
  });
  describe('[inlineSearch.resultChosen] method', function() {

    it('should work for user', function() {
      ctrl.callback = function () { return; };
      ctrl.type = 'user';
      var result = {firstName: 'Test', lastName: 'Testing'};
      ctrl.resultChosen(result, 'nav');

      expect(ctrl.showX).toEqual(true);
      expect(ctrl.chosenResult).toEqual({ firstName: 'Test', lastName: 'Testing' });
      expect(ctrl.chosenResultObject).toEqual({ firstName: 'Test', lastName: 'Testing' });

    });
    it('should work for chain', function() {
      ctrl.callback = function () { return; };
      ctrl.type = 'chain';
      var result = {name: 'testing chain'};
      ctrl.resultChosen(result, 'nav');

      expect(ctrl.showX).toEqual(true);
      expect(ctrl.chosenResult).toEqual({name: 'testing chain'});
      expect(ctrl.chosenResultObject).toEqual({name: 'testing chain'});

    });
    it('should work for location', function() {
      ctrl.callback = function () { return; };
      ctrl.type = 'location';
      var result = {name: 'testing chain'};
      ctrl.resultChosen(result, 'nav');

      expect(ctrl.showX).toEqual(true);
      expect(ctrl.chosenResult).toEqual({name: 'testing chain'});
      expect(ctrl.chosenResultObject).toEqual({name: 'testing chain'});

    });

    it('should work for no defined type', function() {
      ctrl.callback = function () { return; };
      ctrl.type = '';
      ctrl.multipleRecipients = true;
      var result = {name: 'testing chain'};
      ctrl.resultChosen(result, 'nav');

      expect(ctrl.showX).toEqual(true);
      expect(ctrl.chosenResult).toEqual({name: 'testing chain'});
      expect(ctrl.chosenResultObject).toEqual({name: 'testing chain'});
    });
  });
  describe('[inlineSearch.close] method', function() {
    it('should reset the input', function() {
      ctrl.close(true);

      expect(ctrl.input).toEqual('');
      expect(ctrl.showResults).toEqual(false);
    });
  });
  describe('[inlineSearch.onKeypress] method', function() {
    beforeEach(function() {
      spyOn(ctrl, 'action').and.callThrough();
    });

    it('should forward the action', function() {
      ctrl.onKeypress({ charCode: 13, preventDefault: function() { return; } });
      expect(ctrl.action).toHaveBeenCalled();
    });

    it('should do nothing for codes other than 13', function() {
      ctrl.onKeypress({ charCode: 14, preventDefault: function() { return; } });
      expect(ctrl.showLengthError).toEqual(false);
      expect(ctrl.showResults).toEqual(false);

    });
  });
});
