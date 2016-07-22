'use strict';

module.exports =
  function filtersService(productsService, distributorsService) {

    var model = {
      brands: productsService.getProducts('http://jsonplaceholder.typicode.com/posts'),
      distributors: distributorsService.getDistributors('http://jsonplaceholder.typicode.com/posts'),
      premises: [
        {name: 'On Premise'},
        {name: 'Off Premise'}
      ],
      selected: {
        accountScope: false,
        opportunitiesTypes: ''
      }
    };

    return {
      model: model
    };

  };
