'use strict';

module.exports = /*  @ngInject */
  function filterController($state, $scope, $mdDialog, $mdSelect, analyticsService, loaderService, chipsService, filtersService, opportunityFiltersService, userService, usStatesService) {

    // ****************
    // CONTROLLER SETUP
    // ****************
    // Private variables
    const _allTypesOption = 'All Types';
    const _noTypesSelected = 'No Types Selected';
    const _nonBuyOption = 'Non-Buy';
    let _isAllOpportunityTypeClicked = null;
    let _isAllFeatureTypeBeingClicked = false;
    let _isAllItemAuthorizationTypeBeingClicked = false;

    // Initial variables
    var vm = this;
    vm.duplicateName = false;
    vm.opportunities = true;
    vm.hintTextPlaceholder = 'Account or Subaccount Name';
    vm.showSaveButton = true;

    // Expose Needed Services
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.userService = userService;

    // Expose Methods
    vm.appendDoneButton = appendDoneButton;
    vm.applyFilterArr = chipsService.applyFilterArr;
    vm.applyFilterMulti = chipsService.applyFilterMulti;
    vm.applyLocations = applyLocations;
    vm.applyStates = applyStates;
    vm.closeDoneButton = closeDoneButton;
    vm.closeModal = closeModal;
    vm.closeSelect = closeSelect;
    vm.expandDropdown = expandDropdown;
    vm.hoverState = hoverState;
    vm.modalSaveOpportunityFilter = modalSaveOpportunityFilter;
    vm.placeholderSelect = placeholderSelect;
    vm.resetFilters = resetFilters;
    vm.resetTradeChannels = resetTradeChannels;
    vm.saveFilter = saveFilter;
    vm.updateFilter = updateFilter;
    vm.states = usStatesService;
    vm.chooseOpportunityType = chooseOpportunityType;
    vm.changeOpportunitySelection = changeOpportunitySelection;
    vm.chooseFeatureType = chooseFeatureType;
    vm.changeFeatureTypeSelection = changeFeatureTypeSelection;
    vm.chooseItemAuthorizationType = chooseItemAuthorizationType;
    vm.changeItemAuthorizationTypeSelection = changeItemAuthorizationTypeSelection;
    vm.featureTypeText = featureTypeText;
    vm.autorizationProductTypesText = autorizationProductTypesText;
    vm.getDescriptionForFilter = getDescriptionForFilter;
    vm.applyFilters = applyFilters;
    vm.shouldEnableSimpleDistribution = shouldEnableSimpleDistribution;
    vm.isSimpleDistributionOpportunityType = isSimpleDistributionOpportunityType;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function appendDoneButton() {
      // We have to do this so the done button is a sibling of md-select-menu
      angular.element(document.getElementsByClassName('md-select-menu-container'))
        .append('<div class="done-btn">Done</div>').bind('click', function(e) {
          $mdSelect.hide();
        });
    }

    function applyLocations(result) {
      if (result.type === 'zipcode') {
        chipsService.applyFilterArr(filtersService.model.selected.zipCode, result.name, 'zipCode');
      } else if (result.type === 'city') {
        chipsService.applyFilterArr(filtersService.model.selected.city, result.name, 'city');
      }

      filtersService.model.location = '';
    }

    function applyStates(result) {
      chipsService.applyStatesFilter(filtersService.model.state, result, 'state');
    }

    function closeDoneButton() {
      angular.element(document.getElementsByClassName('done-btn')).remove();
    }

    function closeModal() {
      $mdDialog.hide();
    }

    function closeSelect() {
      $mdSelect.hide();
    }

    function expandDropdown() {
      if ($state.current.name === 'target-list-detail') {
        vm.opportunities ? vm.opportunities = false : vm.opportunities = true;
      }

      filtersService.model.expanded ? filtersService.model.expanded = false : filtersService.model.expanded = true;
    }

    function hoverState(icon) {
      if (icon === 'reset') {
        vm.isHoveringReset = !vm.isHoveringReset;
      } else {
        vm.isHoveringSave = !vm.isHoveringSave;
      }
    }

    function modalSaveOpportunityFilter(ev) {
      filtersService.model.newServiceName = '';
      vm.duplicateName = false;
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        template: require('./modal.pug')
      });
    }

    function isSimpleDistributionOpportunityType(oppType) {
      return oppType === 'At Risk' || oppType === 'Non-Buy' || oppType === 'New Placement (No Rebuy)';
    }

    function shouldEnableSimpleDistribution() {
      if (vm.filtersService.model.selected.opportunityType.length === 0) {
        return false;
      }

      let nonSimpleOppTypes = vm.filtersService.model.selected.opportunityType.filter((item) => !isSimpleDistributionOpportunityType(item));

      // enable simple distribution filter if there are no disallowed opp types selected
      return nonSimpleOppTypes.length === 0;
    }

    function chooseOpportunityType(currentSelection) {
      _isAllOpportunityTypeClicked = currentSelection === _allTypesOption;
    }

    function resetToDefaultOpportunityType() {
      vm.filtersService.model.selected.opportunityType = [];

      if (vm.filtersService.model.selected.simpleDistributionType) {
        vm.filtersService.model.selected.opportunityType.push(_nonBuyOption);
      } else {
        vm.filtersService.model.selected.opportunityType.push(_allTypesOption);
      }
    }

    function changeOpportunitySelection() {
      let oppType = vm.filtersService.model.selected.opportunityType;

      if (_isAllOpportunityTypeClicked !== null) {
        if (oppType.length === 0) {
          // We always need to have atleast one option selected
          resetToDefaultOpportunityType();
        } else {
          let allTypesOptionIndex = oppType.indexOf(_allTypesOption);

          if (allTypesOptionIndex !== -1) { // all types is NOT already selected
            if (!_isAllOpportunityTypeClicked) { // user did NOT just click all types
              // If alternate options are clicked we need to remove 'all types'
              oppType.splice(allTypesOptionIndex, 1);
            } else { // user DID just click all types
              // We need to clear array and add only 'all types'
              resetToDefaultOpportunityType();
            }
          }
        }
      }
    }

    function chooseFeatureType(currentSelection) {
      _isAllFeatureTypeBeingClicked = currentSelection === _allTypesOption;
    }

    function changeFeatureTypeSelection() {
      const selected = vm.filtersService.model.selected;

      const currentlySelectedFeatureType = selected.featureType;
      const allFeatureTypes = vm.filtersService.model.featureType.map(type => type.name);

      selected.featureType = adaptTypesSelection(currentlySelectedFeatureType, allFeatureTypes, _isAllFeatureTypeBeingClicked);
    }

    /**
     * Updates an array of types by select all of them if "All Types" is selected,
     * or by unselecting "All Types" if one other element as been unselected
     * @param {Array} currentlySelectedTypes The array containing the user-selected types
     * @param {Array} allTypes The array containing all the possible types.
     * @param {Array} isAllCurrentlySelected Whether or not "All Types" was selected before the user action.
     * @returns {Array} The array with the types updated.
     */
    function adaptTypesSelection(currentlySelectedTypes, allTypes, isAllBeingClicked) {
      const allTypesOptionIndex = currentlySelectedTypes.indexOf(_allTypesOption);
      const allTypesIsSelected = allTypesOptionIndex !== -1;

      let newSelectedTypes = currentlySelectedTypes;

      if (isAllBeingClicked) {
        if (allTypesIsSelected) {
          newSelectedTypes = allTypes;
        } else {
          newSelectedTypes = [];
        }
      } else {
        if (allTypesIsSelected) {
          newSelectedTypes.splice(allTypesOptionIndex, 1);
        } else if (currentlySelectedTypes.length >= allTypes.length - 1) {
          newSelectedTypes = allTypes;
        }
      }

      return newSelectedTypes;
    }

    function chooseItemAuthorizationType(currentSelection) {
      _isAllItemAuthorizationTypeBeingClicked = currentSelection === _allTypesOption;
    }

    function changeItemAuthorizationTypeSelection() {
      const selected = vm.filtersService.model.selected;

      const currentlySelectedItemAuthorizationType = selected.itemAuthorizationType;
      const allFeatureTypes = vm.filtersService.model.itemAuthorizationType.map(type => type.name);

      selected.itemAuthorizationType = adaptTypesSelection(currentlySelectedItemAuthorizationType, allFeatureTypes, _isAllItemAuthorizationTypeBeingClicked);
    }

    function featureTypeText() {
      return vm.filtersService.model.selected.featureType.length === vm.filtersService.model.featureType.length
        ? _allTypesOption
        : vm.filtersService.model.selected.featureType
          ? vm.filtersService.model.selected.featureType.join(', ') || _noTypesSelected
          : _noTypesSelected;
    }

    function autorizationProductTypesText() {
      return vm.filtersService.model.selected.itemAuthorizationType.length === vm.filtersService.model.itemAuthorizationType.length
        ? _allTypesOption
        : vm.filtersService.model.selected.itemAuthorizationType
          ? vm.filtersService.model.selected.itemAuthorizationType.join(', ') || _noTypesSelected
          : _noTypesSelected;
    }

    function placeholderSelect(data) {
      vm.hintTextPlaceholder = data;
    }

    function resetFilters() {
      // reset all chips and filters
      chipsService.resetChipsFilters(chipsService.model);

      filtersService.resetFilters();

      resetTradeChannels('on');
      resetTradeChannels('off');
    }

    function resetTradeChannels(str) {
      var arr = filtersService.model.tradeChannels[str || filtersService.model.selected.premiseType];
      for (var i = 0; i < arr.length; i++) {
        var name =  'tradeChannel' + arr[i].name;
        filtersService.model[name] = false;
      }
      filtersService.model.selected.tradeChannel = [];

      // reset chips
      for (i = 0; i < chipsService.model.length; i++) {
        if (chipsService.model[i].tradeChannel === true) {
          chipsService.model.splice(i, 1);
          i--;
        }
      }
    }

    function getFilterModel(currentFilterModel) {
      var copyFilter = angular.copy(currentFilterModel);
      var cleanedUpFilterObj = filtersService.cleanUpSaveFilterObj(copyFilter);
      return cleanedUpFilterObj;
    }

    function getDescriptionForFilter(currentChipsModel, currentFilterModel) {
      var modifiedFilterModel = getFilterModel(currentFilterModel);
      var currentModel = {
        filterModel: modifiedFilterModel,
        chipsModel: currentChipsModel
      };
      return angular.toJson(currentModel);
    }

    function saveFilter() {
      vm.duplicateName = false;
      loaderService.openLoader(true);
      const chipsDescription = getDescriptionForFilter(chipsService.model, filtersService.model);

      userService.saveOpportunityFilter(chipsDescription).then(response => {
        analyticsService.trackEvent(
          'Opportunities',
          'Save Report',
          response.id
        );

        userService.model.opportunityFilters.unshift({
          filterString: encodeURIComponent(filtersService.model.appliedFilter.appliedFilter),
          name: filtersService.model.newServiceName,
          description: response.description,
          id: response.id
        });

        filtersService.model.newServiceName = null;
        filtersService.disableFilters(true, false, true, false);
        loaderService.closeLoader();
        closeModal();
      })
      .catch(error => {
        if (error.data[0].message.includes('already exists')) vm.duplicateName = true;
        console.error('Error saving report: ', error);
        loaderService.closeLoader();
      });
    }

    function updateFilter() {
      var currentFilter = userService.model.newServiceSelect;
      loaderService.openLoader(true);
      var chipsDescription = getDescriptionForFilter(chipsService.model, filtersService.model);
      opportunityFiltersService.updateOpportunityFilter(currentFilter, 'description', chipsDescription).then(function(data) {
        var selectedFilter = userService.model.opportunityFilters.filter(function(filterVal) {
          return filterVal.id === currentFilter;
        });
        var matchedFilter = selectedFilter[0];
        if (matchedFilter) {
          matchedFilter.filterString = encodeURIComponent(filtersService.model.appliedFilter.appliedFilter);
          matchedFilter.description = chipsDescription;
          filtersService.disableFilters(true, false, true, false);
        } else {
          console.warn('[filterController.updateFilter] - filter could not be updated', currentFilter.id);
        }
        loaderService.closeLoader();
        closeModal();
      }, function(err) {
        console.warn(err);
        loaderService.closeLoader();
      });
    }

    function applyFilters() {
      sendFilterAnalytics();
      // debugger;
      chipsService.applyFilters();
    }

    // **************
    // PRIVATE METHODS
    // **************

    function sendFilterAnalytics() {
      var chip, action, label;

      for (var i = 0; i < chipsService.model.length; i++) {
        chip = chipsService.model[i];

        switch (chip.type) {
          // camelCase to upper case action, id as label
          case 'account':
          case 'subaccount':
          case 'store':
          case 'distributor':
          case 'brand':
            action = chip.type.replace(/([A-Z])/g, ' $1').toUpperCase();
            label = chip.id;
            break;

          // special cases
          case 'myAccountsOnly':
            action = 'ACCOUNT SCOPE';
            label = 'MY ACCOUNTS ONLY';
            break;

          case 'simpleDistributionType':
            action = 'DISTRIBUTION TYPE';
            label = 'SIMPLE';
            break;

          case 'contact':
            action = 'CBBD CONTACT';
            label = chip.id;
            break;

          case 'masterSKU':
            action = 'MASTER SKU';
            label = chip.id;
            break;

          case 'impact':
            action = 'PREDICTED IMPACT';
            label = chip.name.toUpperCase();
            break;

          case 'cbbdChain':
            action = 'STORE TYPE';
            label = chip.name.toUpperCase();
            break;

          case 'segmentation':
            action = 'STORE SEGMENTATION';
            label = chip.name.toUpperCase();
            break;

          case 'salesStatus':
            action = 'STORE STATUS';
            label = chip.name.toUpperCase();
            break;

          case 'storeFormat':
            action = 'STORE FORMAT';
            label = chip.name.toUpperCase();
            break;

          // camelCase to upper case action, upper case label
          case 'premiseType':
          case 'opportunityStatus':
          case 'opportunityType':
          case 'zipCode':
          case 'city':
          case 'state':
          case 'featureType':
          case 'itemAuthorizationType':
          case 'tradeChannel':
          case 'priorityPackage':
          default:
            action = chip.type.replace(/([A-Z])/g, ' $1').toUpperCase();
            label = chip.name.toUpperCase();
            break;
        }

        analyticsService.trackEvent(
          'Filters',
          action,
          label
        );
      }
    }

    function init() {
      if ($state.current.name === 'target-list-detail') {
        vm.opportunities = true;
        vm.showSaveButton = false;
      } else {
        vm.opportunities = false;
        vm.showSaveButton = true;
      }
    }
  };
