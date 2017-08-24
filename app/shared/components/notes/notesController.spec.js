describe('Unit: notes controller', function() {
  var $q, scope, $rootScope, ctrl, notesService, $window, note, callBackData, $httpBackend, files, $timeout, analyticsService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('ngFileUpload');
    angular.mock.module('angulartics');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.notes');
    angular.mock.module('angularMoment');

    angular.mock.module(function($provide) {
      $window = { location: {replace: jasmine.createSpy()} };
      analyticsService = {
        trackEvent: () => {}
      };
      $provide.value('$window', $window);
      $provide.value('analyticsService', analyticsService);
    });

    inject(function(_$rootScope_, $controller, _notesService_, _$q_, $injector, _$httpBackend_, _$timeout_) {
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      scope.analytics = {};
      notesService = _notesService_;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
      $timeout = _$timeout_;

      ctrl = $controller('notesController', {
        $scope: scope,
        $rootscope: scope
      });
    });

    note = {
      attachments: [],
      author: 'meeeee',
      aurhorId: '1234500',
      body: '<p>Objectives</p><div><ul><li>​A</li><li>B</li><li>C</li><li>ME C-store opportunities &amp; Target lists</li></ul><p><br></p></div>',
      date: '2017-02-21T20:51:37.000+0000',
      id: 'a2Xm0000000I9iREAS',
      lastModifiedDate: '2017-02-21T20:51:37.000+0000',
      title: 'Display'
    };
    callBackData = {
      isSuccess: true,
      successReturnValue: [{
        errors: [],
        id: 'a2Xm0000000I9i7EAC',
        success: true
      }]
    };
    files = [{
      lastModified: 1487789547000,
      name: 'file 1',
      size: 6060,
      type: 'image/jpeg'
    }];

    spyOn(angular, 'element').and.returnValue([{scrollTop: 0}]);
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

  it('notes close', function() {
    scope.notesOpen = true;
    ctrl.notes = [1, 2, 3, 4];
    ctrl.notesClose();
    expect(scope.notesOpen).toEqual(false);
    expect(ctrl.notes).toEqual([]);
  });

  it('is editing', function() {
    var tempNote = {
      body: 'test 1',
      title: 'my great note',
      editMode: false
    };
    ctrl.cachedNote = {
      body: 'test B',
      title: 'my old great note'
    };
   ctrl.isEditing(tempNote, true);
   expect(tempNote.body).toEqual(ctrl.cachedNote.body);
   expect(tempNote.title).toEqual(ctrl.cachedNote.title);
   expect(tempNote.editMode).toEqual(true);

   tempNote = {
      body: 'test 2',
      title: 'my next great note',
      editMode: false
    };
   ctrl.isEditing(tempNote, false);
   expect(ctrl.cachedNote).toEqual(tempNote);
  });

  it('create note invalid title', function() {
    ctrl.newNote = {title: null};
    ctrl.createNote({});
    expect(ctrl.invalidCreateNote).toEqual(true);

    ctrl.newNote = {title: ''};
    ctrl.createNote({});
    expect(ctrl.invalidCreateNote).toEqual(true);
  });

  it('create note', function() {
    ctrl.newNote = {title: 'test title'};
    ctrl.notes = [];
    notesService.model.tdlinx = '1234567';

    var data = {
      author: 'Me',
      body: '<p> test note body<p>',
      date: '2017-02-21T18:42:13Z',
      id: 'a2Xm0000000I9i7EAC',
      title: 'Display'
    };

    spyOn(notesService, 'createNote').and.callFake(function() {
      return {
        then: function(callback) { return $q.when(callback(callBackData)); }
      };
    });

    ctrl.createNote(data);
    expect(ctrl.notes[0]).toEqual(data);
    expect(ctrl.newNote).toEqual(null);
    expect(ctrl.creatingNote).toEqual(false);
    expect(ctrl.loading).toEqual(false);
    expect(ctrl.notesError).toEqual(false);

    ctrl.newNote = {title: 'test title'};
    ctrl.notes = [];
    notesService.model.tdlinx = undefined;
    notesService.model.accountId = '9999999';

    ctrl.createNote(data);
    expect(ctrl.notes[0]).toEqual(data);
    expect(ctrl.newNote).toEqual(null);
    expect(ctrl.creatingNote).toEqual(false);
    expect(ctrl.loading).toEqual(false);
    expect(ctrl.notesError).toEqual(false);
  });

  it('save edited note', function() {

    spyOn(notesService, 'updateNote').and.callFake(function() {
      return {
        then: function(callback) { return $q.when(callback(callBackData)); }
      };
    });

    spyOn(notesService, 'accountNotes').and.callFake(function() {
      return {
        then: function(callback) { return $q.when(callback([note])); }
      };
    });

    ctrl.saveEditedNote(note);
    expect(ctrl.notes).toEqual([note]);
    expect(ctrl.loading).toEqual(false);
    expect(ctrl.notesError).toEqual(false);
    expect(ctrl.notes[0].author).toEqual('Me');
  });

  it('save edited note invalid', function() {
    note.title = '';
    ctrl.saveEditedNote(note);
    expect(note.invalidNote).toEqual(true);
  });

  it('mail a subaccount note', function() {
    notesService.model.currentStoreProperty = 'subaccount';
    ctrl.mailNote(note);
    expect($window.location).toEqual('mailto:?subject=: Note: Display&body=%0D%0A%0D%0A%0D%0AObjectives%0D%0A%0D%0A ​A  B  C  ME C-store opportunities &amp; Target lists %0D%0A%0D%0A %0D%0A');
  });

  it('mail a distributor note', function() {
    notesService.model.currentStoreName = 'a distributor llc';
    notesService.model.address = '123 Fake St.';
    notesService.model.city = 'Springfield';
    notesService.model.state = 'XI';
    notesService.model.zipCode = '00000-2222';
    notesService.model.accountId = '7777777';
    notesService.model.currentStoreProperty = 'distributor';
    ctrl.mailNote(note);
    expect($window.location).toEqual('mailto:?subject=a distributor llc: Note: Display&body=a distributor llc%0D%0A%0D%0A123 Fake St.%0D%0ASpringfield, XI 00000-2222%0D%0A%0D%0AID: 7777777%0D%0A%0D%0A%0D%0AObjectives%0D%0A%0D%0A ​A  B  C  ME C-store opportunities &amp; Target lists %0D%0A%0D%0A %0D%0A');
  });

  it('mail a store note', function() {
    notesService.model.currentStoreName = 'a store';
    notesService.model.address = '123 Real St.';
    notesService.model.city = 'Not Springfield';
    notesService.model.state = 'WW';
    notesService.model.zipCode = '11111-2222';
    notesService.model.tdlinx = '999999999';
    notesService.model.currentStoreProperty = 'store';
    ctrl.mailNote(note);
    expect($window.location).toEqual('mailto:?subject=a store: Note: Display&body=a store%0D%0A%0D%0A123 Real St.%0D%0ANot Springfield, WW 11111-2222%0D%0A%0D%0ATDLinx: 999999999%0D%0A%0D%0A%0D%0AObjectives%0D%0A%0D%0A ​A  B  C  ME C-store opportunities &amp; Target lists %0D%0A%0D%0A %0D%0A');
  });

  it('expect delete to toggle', function() {
    note.deleteConfirmation = false;
    ctrl.toggleDelete(note);
    expect(note.deleteConfirmation).toEqual(true);

    note.deleteConfirmation = true;
    ctrl.toggleDelete(note);
    expect(note.deleteConfirmation).toEqual(false);
  });

  it('delete note', function() {
    var data = note;
    var notes = [note, angular.copy(note), angular.copy(note)];
    notes[1].id = 'B3Xm0000000I9iREAS';
    notes[2].id = 'C4Xm0000000I9iREAS';
    ctrl.notes = notes;
    var expectedNotes = [angular.copy(notes[1]), angular.copy(notes[2])];
    expectedNotes[0].author = 'Me';
    expectedNotes[1].author = 'Me';

    spyOn(notesService, 'deleteNote').and.callFake(function() {
      return {
        then: function(callback) { return $q.when(callback({})); }
      };
    });

    ctrl.deleteNote(data, '999999999');
    expect(ctrl.notes).toEqual(expectedNotes);
  });

  it('cancels a new note', function() {
    ctrl.newNote = note;
    ctrl.creatingNote = true;

    ctrl.cancelNewNote(note);
    expect(ctrl.newNote).toEqual({});
    expect(ctrl.creatingNote).toEqual(false);
  });

  it('[addAttachment] should add files to the newNote attachments array if within size limits', function() {
    const newNote = {};
    const attachmentFile1 = {
      lastModified: 1117789547000,
      name: 'file1',
      size: 9999,
      type: 'image/jpeg'
    };
    const attachmentFile2 = {
      lastModified: 1117789547000,
      name: 'file2',
      size: 90000,
      type: 'image/jpeg'
    };
    const attachmentFile3 = {
      lastModified: 1117789547000,
      name: 'file3',
      size: 11000000,
      type: 'image/jpeg'
    };

    expect(newNote.attachments).toEqual(undefined);
    ctrl.addAttachment(newNote, attachmentFile1, undefined);

    expect(newNote.attachments).toEqual([{
      lastModified: 1117789547000,
      name: 'file1',
      size: 9999,
      parsedSize: '10KB',
      type: 'image/jpeg'
    }]);

    ctrl.addAttachment(newNote, attachmentFile2, undefined);

    expect(newNote.attachments).toEqual([{
      lastModified: 1117789547000,
      name: 'file1',
      size: 9999,
      parsedSize: '10KB',
      type: 'image/jpeg'
    }, {
      lastModified: 1117789547000,
      name: 'file2',
      size: 90000,
      parsedSize: '90KB',
      type: 'image/jpeg'
    }]);

    ctrl.addAttachment(newNote, attachmentFile3, undefined);

    expect(newNote.attachments).toEqual([{
      lastModified: 1117789547000,
      name: 'file1',
      size: 9999,
      parsedSize: '10KB',
      type: 'image/jpeg'
    }, {
      lastModified: 1117789547000,
      name: 'file2',
      size: 90000,
      parsedSize: '90KB',
      type: 'image/jpeg'
    }]);
  });

  it('[addAttachment] should set the upload error for the note to true if it exceeds 10MB', function() {
    const note = {
      uploadSizeError: false
    };
    const attachmentFile1 = {
      lastModified: 1117789547000,
      name: 'file1',
      size: 9999,
      type: 'image/jpeg'
    };
    const attachmentFile2 = {
      lastModified: 1117789547000,
      name: 'file2',
      size: 90000,
      type: 'image/jpeg'
    };
    const attachmentFile3 = {
      lastModified: 1117789547000,
      name: 'file3',
      size: 11000000,
      type: 'image/jpeg'
    };

    ctrl.addAttachment(note, attachmentFile3, {});
    expect(note.uploadSizeError).toEqual(true);

    ctrl.addAttachment(note, attachmentFile1, undefined);
    expect(note.uploadSizeError).toEqual(false);

    ctrl.addAttachment(note, attachmentFile2, undefined);
    expect(note.uploadSizeError).toEqual(false);

    ctrl.addAttachment(note, attachmentFile3, undefined);
    expect(note.uploadSizeError).toEqual(true);
  });

  it('[uploadFiles] should upload files', function() {
    ctrl.newNote = note;

    $httpBackend.expect('POST', '/sfdc/createAttachment').respond(200, {test: 1});

    spyOn(notesService, 'accountNotes').and.callFake(function() {
      return {
        then: function(callback) { return $q.when(callback([angular.copy(note)])); }
      };
    });

    ctrl.uploadFiles(files, '1234');
    $httpBackend.flush();
    $timeout.flush();

    expect(ctrl.loading).toEqual(false);
    expect(ctrl.notes).toEqual([{
      attachments: [],
      author: 'Me',
      aurhorId: '1234500',
      body: '<p>Objectives</p><div><ul><li>​A</li><li>B</li><li>C</li><li>ME C-store opportunities &amp; Target lists</li></ul><p><br></p></div>',
      date: '2017-02-21T20:51:37.000+0000',
      id: 'a2Xm0000000I9iREAS',
      lastModifiedDate: '2017-02-21T20:51:37.000+0000',
      title: 'Display'
    }]);
    expect(ctrl.notesError).toEqual(false);
    expect(ctrl.fileUploading).toEqual(false);
  });

  it('should return max size remaining', function() {
    note.attachments = null;
    var size = ctrl.getMaxFileSize(note);
    expect(size).toEqual('10000KB');

    note.attachments = [{bodyLength: 6000}, {bodyLength: 3040}];
    size = ctrl.getMaxFileSize(note);
    expect(size).toEqual('960KB');

    note.attachments = [{bodyLength: 6000}, {bodyLength: 4000}];
    size = ctrl.getMaxFileSize(note);
    expect(size).toEqual('0KB');

    note.attachments = [{bodyLength: 10001}, {bodyLength: 0}];
    size = ctrl.getMaxFileSize(note);
    expect(size).toEqual('0KB');
  });

  it('delete attachment', function() {
    var returnNote = angular.copy(note);
    note.author = 'Me';

    spyOn(notesService, 'deleteAttach').and.callFake(function() {
      return {
        then: function(callback) { return $q.when(callback({})); }
      };
    });
    spyOn(notesService, 'accountNotes').and.callFake(function() {
      return {
        then: function(callback) { return $q.when(callback([returnNote])); }
      };
    });
    ctrl.notes = null;
    ctrl.deleteAttachment({attachId: '1234565'});
    expect(ctrl.notes).toEqual([note]);
    expect(ctrl.notesError).toEqual(false);
    expect(ctrl.loading).toEqual(false);
  });

  describe('Edit Note GA', () => {

    it('should log a GA event based on the passed in note data and current notesService.model.currentStoreProperty', () => {
      const noteMock = { id: '123-456-789', title: 'Note Title' };

      spyOn(analyticsService, 'trackEvent');
      spyOn(notesService, 'updateNote').and.callFake(() => {
        const defer = $q.defer();
        defer.resolve(noteMock);
        return defer.promise;
      });
      spyOn(notesService, 'accountNotes').and.callFake(() => {
        const defer = $q.defer();
        defer.resolve([noteMock]);
        return defer.promise;
      });

      notesService.model.currentStoreProperty = 'distributor';
      ctrl.saveEditedNote(noteMock);
      scope.$apply();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Distributor Notes',
        'Edit Note',
        '123-456-789'
      );

      notesService.model.currentStoreProperty = 'store';
      ctrl.saveEditedNote(noteMock);
      scope.$apply();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Retailer Notes',
        'Edit Note',
        '123-456-789'
      );
    });
  });

  describe('Create Note GA', () => {
    const noteDataMock = { accountType: 'store' };

    beforeEach(() => {
      ctrl.newNote = { title: 'Mock Title' };
      ctrl.notes = [];

      spyOn(analyticsService, 'trackEvent');
    });

    it('should log a Distributor GA event when notesService.createNote is successful for a distributor', () => {
      notesService.model.currentStoreProperty = 'distributor';

      spyOn(notesService, 'createNote').and.callFake(() => {
        const defer = $q.defer();
        defer.resolve({ successReturnValue: [{ id: '10' }] });
        return defer.promise;
      });

      $httpBackend.expectPOST('/v2/sfdcNotifications/').respond(200);
      ctrl.createNote(noteDataMock);
      scope.$apply();

      expect(notesService.createNote).toHaveBeenCalled();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Distributor Notes',
        'Create Note',
        '10'
      );
    });

    it('should log a Retailer GA event when notesService.createNote is successful for a store', () => {
      notesService.model.currentStoreProperty = 'store';

      spyOn(notesService, 'createNote').and.callFake(() => {
        const defer = $q.defer();
        defer.resolve({ successReturnValue: [{ id: '10' }] });
        return defer.promise;
      });

      $httpBackend.expectPOST('/v2/sfdcNotifications/').respond(200);
      ctrl.createNote(noteDataMock);
      scope.$apply();

      expect(notesService.createNote).toHaveBeenCalled();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Retailer Notes',
        'Create Note',
        '10'
      );
    });

    it('should NOT log a GA event when notesService.createNote returns an error', () => {
      notesService.model.currentStoreProperty = 'distributor';

      spyOn(notesService, 'createNote').and.callFake(() => {
        const defer = $q.defer();
        defer.reject({ error: 'Error' });
        return defer.promise;
      });

      ctrl.createNote(noteDataMock);
      scope.$apply();

      expect(notesService.createNote).toHaveBeenCalled();
      expect(analyticsService.trackEvent).not.toHaveBeenCalled();
    });
  });

  describe('Delete Note GA', () => {

    it('should log a GA event when notesService.deleteNote is successful', () => {
      notesService.model.currentStoreProperty = 'distributor';
      ctrl.notes = [];

      spyOn(notesService, 'deleteNote').and.callFake(() => {
        const defer = $q.defer();
        defer.resolve(true);
        return defer.promise;
      });
      spyOn(analyticsService, 'trackEvent');

      ctrl.deleteNote({ id: '10' });
      scope.$apply();

      expect(notesService.deleteNote).toHaveBeenCalled();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Distributor Notes',
        'Delete Note',
        '10'
      );

      notesService.model.currentStoreProperty = 'store';
      ctrl.deleteNote({ id: '10' });
      scope.$apply();

      expect(notesService.deleteNote).toHaveBeenCalled();
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Retailer Notes',
        'Delete Note',
        '10'
      );
    });

    it('should NOT log a GA event when notesService.deleteNote returns an error', () => {
      spyOn(notesService, 'deleteNote').and.callFake(() => {
        const defer = $q.defer();
        defer.reject(true);
        return defer.promise;
      });
      spyOn(analyticsService, 'trackEvent');

      ctrl.deleteNote({ id: '10' });
      scope.$apply();

      expect(notesService.deleteNote).toHaveBeenCalled();
      expect(analyticsService.trackEvent).not.toHaveBeenCalled();
    });
  });

  describe('Read More Note GA', () => {

    it('should log a GA event when `Read More` is clicked on a note', () => {
      spyOn(analyticsService, 'trackEvent');

      notesService.model.currentStoreProperty = 'distributor';
      ctrl.readMore({ id: '10' });
      scope.$apply();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Distributor Notes',
        'Read More',
        '10'
      );

      notesService.model.currentStoreProperty = 'store';
      ctrl.readMore({ id: '10' });
      scope.$apply();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Retailer Notes',
        'Read More',
        '10'
      );
    });
  });

  describe('Mail Note GA', () => {

    it('should log a GA event when e-mailing a note', () => {
      spyOn(analyticsService, 'trackEvent');

      notesService.model.currentStoreProperty = 'distributor';
      ctrl.mailNote({ id: '10', body: 'Mock Note' });
      scope.$apply();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Distributor Notes',
        'Email Note',
        '10'
      );

      notesService.model.currentStoreProperty = 'store';
      ctrl.mailNote({ id: '10', body: 'Mock Note' });
      scope.$apply();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Retailer Notes',
        'Email Note',
        '10'
      );
    });
  });

  describe('Note Attachment GA', () => {

    it('should log a GA event when clicking a note\'s attachment', () => {
      spyOn(analyticsService, 'trackEvent');

      notesService.model.currentStoreProperty = 'distributor';
      ctrl.attachmentClicked('123456');
      scope.$apply();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Distributor Notes',
        'View Attachment',
        '123456'
      );

      notesService.model.currentStoreProperty = 'store';
      ctrl.attachmentClicked('654321');
      scope.$apply();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Retailer Notes',
        'View Attachment',
        '654321'
      );
    });
  });
});
