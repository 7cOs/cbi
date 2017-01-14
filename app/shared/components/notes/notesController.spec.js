describe('Unit: notes controller', function() {
  // var scope, $rootScope, ctrl, $q, $httpBackend, $mdMenu, $state, userService, notesService, Upload, moment;
  var scope, $rootScope, ctrl;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('ngFileUpload');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.notes');
    angular.mock.module('angularMoment');

    // inject(function(_$rootScope_, $controller, _$q_, _$httpBackend_, _$window_, _$state_, _$mdMenu_, _notesService_, _userService_, _Upload_, _moment_) {
    inject(function(_$rootScope_, $controller) {
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      scope.analytics = {};

      ctrl = $controller('notesController', {
        $scope: scope,
        $rootscope: scope
      });
      // $q = _$q_;
      // $httpBackend = _$httpBackend_;
      // $state = _$state_;
      // $mdMenu = _$mdMenu_;
      // notesService = _notesService_;
      // userService = _userService_;
      // Upload = _Upload_;
    });
  });

  it('should expose public methods', function() {
    expect(ctrl.isEditing).not.toBeUndefined();
    expect(typeof (ctrl.isEditing)).toEqual('function');

    expect(ctrl.openNotes).not.toBeUndefined();
    expect(typeof (ctrl.openNotes)).toEqual('function');

    expect(ctrl.readMore).not.toBeUndefined();
    expect(typeof (ctrl.readMore)).toEqual('function');

    expect(ctrl.openCreateNote).not.toBeUndefined();
    expect(typeof (ctrl.openCreateNote)).toEqual('function');

    expect(ctrl.createNote).not.toBeUndefined();
    expect(typeof (ctrl.createNote)).toEqual('function');

    expect(ctrl.deleteNote).not.toBeUndefined();
    expect(typeof (ctrl.deleteNote)).toEqual('function');

    expect(ctrl.toggleDelete).not.toBeUndefined();
    expect(typeof (ctrl.toggleDelete)).toEqual('function');

    expect(ctrl.cancelNewNote).not.toBeUndefined();
    expect(typeof (ctrl.cancelNewNote)).toEqual('function');

    expect(ctrl.updateNote).not.toBeUndefined();
    expect(typeof (ctrl.updateNote)).toEqual('function');

    expect(ctrl.showImage).not.toBeUndefined();
    expect(typeof (ctrl.showImage)).toEqual('function');

    expect(ctrl.isAuthor).not.toBeUndefined();
    expect(typeof (ctrl.isAuthor)).toEqual('function');

    expect(ctrl.mailNote).not.toBeUndefined();
    expect(typeof (ctrl.mailNote)).toEqual('function');

    expect(ctrl.formatEmailString).not.toBeUndefined();
    expect(typeof (ctrl.formatEmailString)).toEqual('function');

    expect(ctrl.saveEditedNote).not.toBeUndefined();
    expect(typeof (ctrl.saveEditedNote)).toEqual('function');
  });
});
