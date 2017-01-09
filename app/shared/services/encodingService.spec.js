describe('[Services.encodingService]', function() {
  var encodingService,
    mockWindow;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    angular.mock.module(function($provide) {
      mockWindow = {
        CryptoJS: {
          enc: {
            Base64: {
              parse: jasmine.createSpy('parse')
            },
            Utf8: 'myUtf8Encoding'
          }
        }
      };

      $provide.value('$window', mockWindow);
    });

    inject(function(_encodingService_) {
      encodingService = _encodingService_;
    });
  });

  it('should exist', function() {
    expect(encodingService).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(encodingService.base64Decode).toBeDefined();
  });

  describe('[base64Decode]', function() {
    it('should use CryptoJS to decode base64 string as UTF-8 string', function() {
      var testValue = 'myTestValue',
        mockParsedObject = {
          toString: jasmine.createSpy('toString')
        },
        expectedDecodedValue = 'myDecodedValue',
        actualDecodedValue;

      mockParsedObject.toString.and.returnValue(expectedDecodedValue);
      mockWindow.CryptoJS.enc.Base64.parse.and.returnValue(mockParsedObject);

      actualDecodedValue = encodingService.base64Decode(testValue);

      expect(mockWindow.CryptoJS.enc.Base64.parse).toHaveBeenCalledWith(testValue);
      expect(mockParsedObject.toString).toHaveBeenCalledWith(mockWindow.CryptoJS.enc.Utf8);
      expect(actualDecodedValue).toEqual(expectedDecodedValue);
    });
  });
});
