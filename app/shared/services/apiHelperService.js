'use strict';

module.exports = /*  @ngInject */
  function apiHelperService(filtersService) {

    var model = {
      bulkQuery: false
    };

    return {
      model: model,
      formatQueryString: formatQueryString,
      request: request
    };

    /**
     * @name formatQueryString
     * @desc transforms object in key-value pairs to a string to be submitted to api
     * @params {Object} obj - object to be mapped
     * @returns {String} - formatted query
     * @memberOf cf.common.services
     */
    function formatQueryString(obj) {
      var queryParams = '',
          i = 0,
          z = getKeyLength(obj) - 1;
      var key1, filterQueryParams;

      function getKeyLength(data) {
        var l = 0;
        for (var prop in data) {
          if (data.hasOwnProperty(prop)) {
            l++;
          }
        }
        return l;
      }

      if (obj.type && obj.type === 'opportunities') {
        const pageQuery = applyPage();
        const sortQuery = applySort();
        const simpleQuery = applySimpleDist(obj);
        const salesStoreStatus = applySalesStoreStatus(obj);
        const storeFormatQuery = applyStoreFormatQuery(obj);
        const priorityPackagesQuery = applyPriorityPackageQuery(obj);
        let queryStr = '';

        queryParams += '';

        // remove type obj
        delete obj.type;

        queryParams += parseAppliedFilters(obj, i, z);

        filtersService.model.appliedFilter.appliedFilter = queryParams;

        const bulkifiedLimitSortPage = `${model.bulkQuery ? 'limit=1000' : 'limit=20' + sortQuery + pageQuery}`;
        model.bulkQuery = false;

        queryStr = `?${bulkifiedLimitSortPage}&ignoreDismissed=true${simpleQuery}${salesStoreStatus}${storeFormatQuery}${priorityPackagesQuery}&filter=${encodeURIComponent(filtersService.model.appliedFilter.appliedFilter)}`;

        return queryStr;
      } else if (obj.type && obj.type === 'targetListOpportunities') {
        const pageQuery = applyPage();
        const sortQuery = applySort();
        delete obj.type;

        return `?limit=20${sortQuery}${pageQuery}`;
      } else if (obj.type && obj.type === 'targetLists') {
        delete obj.type;

        queryParams += 'archived=true';

        return '?' + queryParams;
      } else if (obj.type && obj.type === 'noencode') {
        queryParams += 'filter=';

        // remove type obj
        delete obj.type;

        for (var key4 in obj) {
          queryParams += key4 + ':' + obj[key4];
          if (i !== z) queryParams += ',';
          i++;
        }

        return '?' + queryParams;
      } else if (obj.type && obj.type === 'brandSnapshot') {
        // remove type obj
        delete obj.type;

        queryParams += '?';

        for (key1 in obj.additionalParams) {
          queryParams += key1 + '=' + encodeURIComponent(obj.additionalParams[key1]) + '&';
        }

        delete obj.additionalParams;

        queryParams += 'filter=';
        queryParams += encodeURIComponent(parseAppliedFilters(obj, i, z));

        // console.log('queryParams - brandSnapshot', decodeURIComponent(queryParams));

        return queryParams;
      } else if (obj.type && obj.type === 'topBottom') {
        queryParams = '?';

        for (key1 in obj.additionalParams) {
          queryParams += key1 + '=' + encodeURIComponent(obj.additionalParams[key1]) + '&';
        }

        delete obj.type;
        delete obj.additionalParams;

        filterQueryParams = parseAppliedFilters(obj, i, z);
        queryParams += 'filter=' + encodeURIComponent(filterQueryParams);

        // console.log('queryParams - topBottom', decodeURIComponent(queryParams));

        return queryParams;
      } else {
        // remove type obj
        delete obj.type;

        for (var key5 in obj) {
          queryParams += key5 + ':' + obj[key5];
          if (i !== z) queryParams += ',';
          i++;
        }

        return '?filter=' + encodeURIComponent(queryParams);
      }
    }

    /**
     * @name request
     * @desc generate request url
     * @params {String} base - base api url to hit [required]
     * @params {Object} paramsObj - filter params [optional]
     * @returns {String} - formatted url
     * @memberOf cf.common.services
     */
    function request(base, paramsObj) {
      var q = '';

      if (paramsObj) q = formatQueryString(paramsObj);

      return base + q;
    }

    /* Private Methods */
    /**
     * @name applyPage
     * @desc applies a page to opportunities request
     * @returns {String} - formatted query
     * @memberOf cf.common.services
     */
    function applyPage() {
      return '&offset=' + filtersService.model.appliedFilter.pagination.currentPage;
    }

    /**
     * @name applySort
     * @desc applies a sort to opportunities request
     * @returns {String} - formatted query
     * @memberOf cf.common.services
     */
    function applySort() {
      var arr = angular.copy(filtersService.model.appliedFilter.sort.sortArr),
          str = '';

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].asc) {
          str += arr[i].str + ':ascending';
        } else {
          str += arr[i].str + ':descending';
        }

        if (arr.length - 1 !== i) str += ',';
      }
      return '&sort=' + str;
    }

    /**
     * @name applySimpleDist
     * @desc applies simple distribution filter to opportunities request
     * @returns {String} - formatted query
     * @memberOf cf.common.services
     */
    function applySimpleDist(filters) {
      let query = '';

      if (filters && filters.simpleDistributionType) {
        query = '&brandOpportunityType=true';
        if (filters.masterSKU) {
          filters.masterSKU.forEach(function(sku) {
            (filters.brand)
              ? (filters.brand).push(sku.slice(sku.search('@') + 1, sku.length))
              : filters.brand = [sku.slice(sku.search('@') + 1, sku.length)];
          });
          delete filters.masterSKU;
        }
      }

      return query;
    }

    /**
     * @name applySalesStoreStatus
     * @desc applies sold or unsold status filter to opportunities request
     * @returns {String} - formatted query
     * @memberOf cf.common.services
     */
    function applySalesStoreStatus(filters) {
      let query = '';

      if (filters && filters.salesStatus) {
        if (filters.salesStatus.length === 2) {
          query = '';
        } else if (filters.salesStatus[0] === 'Unsold') {
          query = '&unsoldStore=true';
        } else if (filters.salesStatus[0] === 'Sold') {
          query = '&unsoldStore=false';
        }
      }

      return query;
    }

    function parseAppliedFilters(obj, i, z) {
      var queryParams = '';

      for (var key2 in obj) {
        var somethingAdded = false;
        if (obj[key2] && obj[key2].constructor === Array && obj[key2].length > 0) {
          if (key2 === 'cbbdChain') { // Both selected and None, leave blank
            if (obj[key2].length === 1 && obj[key2][0] === 'Independent') {
              queryParams += 'cbbdChain:false';
              somethingAdded = true;
            } else if (obj[key2].length === 1 && obj[key2][0] === 'Cbbd') {
              queryParams += 'cbbdChain:true';
              somethingAdded = true;
            }
          } else if (key2 === 'salesStatus') {
            somethingAdded = false;
          } else {
            // iterate over arrays
            for (var k = 0; k < obj[key2].length; k++) {
              if (obj[key2][k] && (key2 === 'opportunityType' && obj[key2][k].toUpperCase() === 'ALL TYPES') || key2 === 'priorityPackage') break;
              if (k === 0) queryParams += key2 + ':';
              // transform opp types to db format
              if (key2 === 'opportunityType') {
                if (obj[key2][k].toUpperCase() === 'CUSTOM') {
                  queryParams += 'MANUAL';
                } else {
                  queryParams += obj[key2][k].replace(/["'()]/g, '').replace(/[__-\s]/g, '_').toUpperCase();
                }
              } else if (key2 === 'featureType') {
                const typeKey = filtersService.model.featureType.filter(type => type.name === obj[key2][k])[0].key;
                if (typeKey) queryParams += typeKey;
              } else if (key2 === 'itemAuthorizationType') {
                const itemAuthKey = filtersService.model.itemAuthorizationType.filter(type => type.name === obj[key2][k])[0].key;
                if (itemAuthKey) queryParams += itemAuthKey;
              } else if (key2 === 'impact') {
                queryParams += obj[key2][k].slice(0, 1);
              } else if (key2 === 'opportunityStatus') {
                if (obj[key2][k] === 'closed') {
                  queryParams += 'targeted'; // closed is the same thing as targeted in api.
                } else {
                  queryParams += obj[key2][k].toLowerCase();
                }
              } else if (key2 === 'tradeChannel') {
                var tradeChannelValue = filtersService.model.tradeChannels[filtersService.model.selected.premiseType].map(function(e) {
                  if (e.name === obj[key2][k]) return e.value;
                });
                for (var l = 0; l < tradeChannelValue.length; l++) {
                  if (tradeChannelValue[l]) queryParams += tradeChannelValue[l];
                }
              } else if (key2 === 'distributor' && obj[key2][k]) {
                queryParams += obj[key2][k].id;
              } else if (key2 === 'masterSKU') {
                queryParams += obj[key2][k].slice(0, obj[key2][k].search('@'));
              } else {
                queryParams += obj[key2][k];
              }

              // add separator if it's not last item
              if (key2 === 'distributor') {
                if (obj[key2].length - 1 !== k) queryParams += '|';
              } else {
                if (obj[key2].length - 1 !== k && obj[key2][k].toUpperCase() !== 'ALL TYPES') queryParams += '|';
              }
              somethingAdded = true;
            }
          }
        } else if (key2 === 'premiseType') {
          if (obj[key2] !== 'all') {
            queryParams += key2 + ':' + obj[key2];
            somethingAdded = true;
          }
        } else if (key2 === 'simpleDistributionType' || key2 === 'storeFormat' || key2 === 'retailer') {
          somethingAdded = false;
        } else if (obj[key2].constructor !== Array) {
          queryParams += key2 + ':' + obj[key2];
          somethingAdded = true;
        }

        if (i !== (z - 1) && somethingAdded) queryParams += ',';
        i++;
      }
      // return queryParams.replace(/,$/g, '');
      return queryParams;
    }

    function applyStoreFormatQuery(queries) {
      return (queries.storeFormat) ? `&hispanicMarketType=${queries.storeFormat}` : '';
    }

    function applyPriorityPackageQuery(queries) {
      let priorityPackageParameters = '';

      if (queries.priorityPackage) {
        priorityPackageParameters = '&priorityPackageGroups=';
        const nbSelectedPriorityPackages = queries.priorityPackage.length;

        queries.priorityPackage.forEach((selectedPriority, index) => {
          const selectedPriorityValue = filtersService.model.priorityPackages.find((priority) => priority.name === selectedPriority).value;
          priorityPackageParameters = `${priorityPackageParameters}${selectedPriorityValue}${index < nbSelectedPriorityPackages - 1 ? '|' : ''}`;
        });
      }

      return priorityPackageParameters;
    }
  };
