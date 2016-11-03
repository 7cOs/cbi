describe('[Services.targetListService]', function() {
  var $http, $q, $httpBackend, targetListService, apiHelperService, opportunitiesService, filtersService;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(_$http_, _$q_, _$httpBackend_, _targetListService_, _apiHelperService_, _opportunitiesService_, _filtersService_) {
      $http = _$http_;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
      targetListService = _targetListService_;
      apiHelperService = _apiHelperService_;
      opportunitiesService = _opportunitiesService_;
      filtersService = _filtersService_;
    });
  });

  it('should exist', function() {
    expect($http).toBeDefined();
    expect($q).toBeDefined();
    expect(targetListService).toBeDefined();
    expect(apiHelperService).toBeDefined();
    expect(opportunitiesService).toBeDefined();
    expect(filtersService).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(targetListService.model).toBeDefined();
    expect(targetListService.getTargetList).toBeDefined();
    expect(targetListService.updateTargetList).toBeDefined();
    expect(targetListService.deleteTargetList).toBeDefined();
    expect(targetListService.getTargetListOpportunities).toBeDefined();
    expect(targetListService.addTargetListOpportunities).toBeDefined();
    expect(targetListService.deleteTargetListOpportunities).toBeDefined();
    expect(targetListService.getTargetListShares).toBeDefined();
    expect(targetListService.addTargetListShares).toBeDefined();
    expect(targetListService.updateTargetListShares).toBeDefined();
    expect(targetListService.deleteTargetListShares).toBeDefined();
    expect(apiHelperService.request).toBeDefined();
    expect(opportunitiesService.model).toBeDefined();
    expect(filtersService.model).toBeDefined();
    expect(filtersService.getAppliedFilters).toBeDefined();
  });

  describe('[getTargetList]', function() {
    it('get target list should return a promise', function() {
      var result = targetListService.getTargetList(1, {});
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should get target lists if id is passed', function() {
      $httpBackend.expect('GET', '/api/targetLists/1').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.getTargetList('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[updateTargetList]', function() {
    it('update target list should return a promise', function() {
      var result = targetListService.updateTargetList(1, {});
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should update target lists if id is passed', function() {
      $httpBackend.expect('PATCH', '/api/targetLists/1').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.updateTargetList('1', {}).then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[deleteTargetList]', function() {
    it('delete target list should return a promise', function() {
      var result = targetListService.deleteTargetList();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should delete target list if id is passed', function() {
      $httpBackend.expect('DELETE', '/api/targetLists/1').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.deleteTargetList('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[getTargetListOpportunities]', function() {
    it('get target list opportunities should return a promise', function() {
      var result = targetListService.getTargetListOpportunities(1, {});
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should get target list opportunities if id is passed', function() {
      var filterPayload = filtersService.getAppliedFilters('opportunities'),
          url = apiHelperService.request('/api/targetLists/1/opportunities', filterPayload);

      $httpBackend.expect('GET', url).respond(200, {
        status: 'success',
        opportunities: []
      });

      var result;
      targetListService.getTargetListOpportunities('1', filterPayload).then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[addTargetListOpportunities]', function() {
    it('add target list opportunities should return a promise', function() {
      var result = targetListService.addTargetListOpportunities();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should add target list opportunities if id is passed', function() {
      $httpBackend.expect('POST', '/api/targetLists/1/opportunities/').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.addTargetListOpportunities('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[deleteTargetListOpportunities]', function() {
    it('delete target list opportunities should return a promise', function() {
      var result = targetListService.deleteTargetListOpportunities();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should delete target list opportunities if id is passed', function() {
      $httpBackend.expect('DELETE', '/api/targetLists/1/opportunities/').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.deleteTargetListOpportunities('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[addTargetListShares]', function() {
    it('add target list shares should return a promise', function() {
      var result = targetListService.addTargetListShares();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should add target list shares if id is passed', function() {
      $httpBackend.expect('POST', '/api/targetLists/1/shares').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.addTargetListShares('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[updateTargetListShares]', function() {
    it('update target list shares should return a promise', function() {
      var result = targetListService.updateTargetListShares();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should update target list shares if id is passed', function() {
      $httpBackend.expect('PATCH', '/api/targetLists/1/shares').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.updateTargetListShares('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[deleteTargetListShares]', function() {
    it('delete target list shares should return a promise', function() {
      var result = targetListService.deleteTargetListShares();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should delete target list shares if id is passed', function() {
      $httpBackend.expect('DELETE', '/api/targetLists/1/shares').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.deleteTargetListShares('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

});
