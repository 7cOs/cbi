describe('[Services.notesService - performance]', function() {
  var $httpBackend, notesService, note, returnedPromise;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(_$http_, _$httpBackend_, _notesService_) {
      $httpBackend = _$httpBackend_;
      notesService = _notesService_;
    });
  });

  note = {
      id: '5784584578475',
      title: 'display',
      body: 'note body',
      author: 'author name',
      authorId: '456',
      date: '2016-10-12T19:29:33.000+0000',
      lastModifiedDate: '2017-10-12T19:29:33.000+0000',
      attachments: [{
          fileName: 'attachment 1 name',
          bodyLength: 2,
          fileSize: '2 KB',
          url: 'test/url',
          fileType: 'jpeg',
          attachId: '0000ooooo555'
        }]};

  it('should get note - success', function() {
      var notesPayload = {
          successReturnValue: [{
              Attachments: {
                  records: [{
                      Name: 'attachment 1 name',
                      BodyLength: 2000,
                      attributes: {
                          compassUrl: 'test/url'
                      },
                      ContentType: 'jpeg',
                      Id: '0000ooooo555'
                  }]},
              Id: '5784584578475',
              Type__c: 'display',
              CreatedBy: {
                  Name: 'author name',
                  CBI_Employee_ID__c: '456'
                },
              Comments_RTF__c: 'note body',
              CreatedDate: '2016-10-12T19:29:33.000+0000',
              LastModifiedDate: '2017-10-12T19:29:33.000+0000'
          }]};
      notesService.model.accountId = '444444444';
      $httpBackend
        .expect('GET', '/sfdc/accountNotes?accountId=444444444')
        .respond(200, notesPayload);

        var returnedPromise = notesService.accountNotes();
        $httpBackend.flush();
        expect(returnedPromise.$$state.status).toEqual(1);
        expect(returnedPromise.$$state.value).toEqual([note]);
  });

    it('should get note - fail', function() {
      notesService.model.accountId = '444444444';
      $httpBackend
        .expect('GET', '/sfdc/accountNotes?accountId=444444444')
        .respond(400, 'no note today');

        returnedPromise = notesService.accountNotes();
        $httpBackend.flush();
        expect(returnedPromise.$$state.status).toEqual(2);
        expect(returnedPromise.$$state.value.data).toEqual('no note today');
  });

  it('should create note - success', function() {
      $httpBackend
        .expect('POST', '/sfdc/createNote?accountId=0000000003')
        .respond(200, 'note payload');
      returnedPromise = notesService.createNote('test body 2', '0000000003');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);
      expect(returnedPromise.$$state.value).toEqual('note payload');
  });

    it('should create note - fail', function() {
      $httpBackend
        .expect('POST', '/sfdc/createNote?accountId=0000000003')
        .respond(400, 'no note today');
      returnedPromise = notesService.createNote('test body 2', '0000000003');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);
      expect(returnedPromise.$$state.value.data).toEqual('no note today');
  });

  it('should update note - success', function() {
      $httpBackend
      .expect('POST', '/sfdc/updateNote?noteId=5784584578475')
      .respond(200, 'note payload');

      returnedPromise = notesService.updateNote(note);
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);
      expect(returnedPromise.$$state.value).toEqual('note payload');
  });

  it('should update note - fail', function() {
      $httpBackend
      .expect('POST', '/sfdc/updateNote?noteId=5784584578475')
      .respond(400, 'no note today');

      returnedPromise = notesService.updateNote(note);
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);
      expect(returnedPromise.$$state.value.data).toEqual('no note today');
  });

  it('should delete attachment - success', function() {
      $httpBackend
      .expect('DELETE', '/sfdc/deleteAttachment?attachmentId=00000099999900000')
      .respond(200, 'success');

      returnedPromise = notesService.deleteAttach('00000099999900000');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);
      expect(returnedPromise.$$state.value).toEqual('success');
  });

  it('should delete attachment - fail', function() {
      $httpBackend
      .expect('DELETE', '/sfdc/deleteAttachment?attachmentId=00000099999900000')
      .respond(400, 'fail');

      returnedPromise = notesService.deleteAttach('00000099999900000');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);
      expect(returnedPromise.$$state.value.data).toEqual('fail');
  });

  it('should delete note - success', function() {
      $httpBackend
      .expect('DELETE', '/sfdc/deleteNote?noteId=5784584578475')
      .respond(200, 'success');

      returnedPromise = notesService.deleteNote(note.id);
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);
      expect(returnedPromise.$$state.value).toEqual('success');
  });

  it('should delete note - fail', function() {
      $httpBackend
      .expect('DELETE', '/sfdc/deleteNote?noteId=5784584578475')
      .respond(400, 'fail');

      returnedPromise = notesService.deleteNote(note.id);
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);
      expect(returnedPromise.$$state.value.data).toEqual('fail');
  });

  it('user info - success', function() {
      $httpBackend
      .expect('GET', '/sfdc/userInfo')
      .respond(200, {isSuccess: true, successReturnValue: true});

      returnedPromise = notesService.userInfo();
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);
      expect(returnedPromise.$$state.value).toEqual(true);
  });

  it('user info - fail 1', function() {
      $httpBackend
      .expect('GET', '/sfdc/userInfo')
      .respond(200, {isSuccess: false, successReturnValue: true});

      returnedPromise = notesService.userInfo();
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);
      expect(returnedPromise.$$state.value.data).toEqual({ isSuccess: false, successReturnValue: true });
  });

  it('user info - fail 2', function() {
      $httpBackend
      .expect('GET', '/sfdc/userInfo')
      .respond(400, 'fail');

      returnedPromise = notesService.userInfo();
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);
      expect(returnedPromise.$$state.value.data).toEqual('fail');
  });
});
