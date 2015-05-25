'use strict';

var assert = require('chai').assert;
var errorHandler = require('../../lib/error-handler');
var ParserError = require('../../lib/parser-error');

describe('errorHandler', function() {

  var error;

  beforeEach(function(){
    errorHandler.clearErrors();
    error = new ParserError('error message');
  });

  it('should be global', function() {
    var secondErrorHandler = require('../../lib/error-handler');
    errorHandler.add(error);
    assert.include(secondErrorHandler.errors, error);
  });

  describe('add()', function() {
    it('should add an error to the array', function() {
      errorHandler.add(error);
      assert.include(errorHandler.errors, error);
    });

    it('should convert an Error to a ParserError', function() {
      var standardError = new Error('standardErrorMessage');
      errorHandler.add(standardError);

      assert.instanceOf(errorHandler.errors[0], ParserError);
      assert.equal(errorHandler.errors[0].message, 'standardErrorMessage');
    });
  });

  describe('clearErrors()', function() {
    it('should remove the errors', function() {
      errorHandler.add(error);
      errorHandler.clearErrors();
      assert.lengthOf(errorHandler.errors, 0);
    });

    it('should keep the same array', function() {
      var arrayOrigin = errorHandler.errors;
      errorHandler.clearErrors();
      assert.equal(arrayOrigin, errorHandler.errors);
    });
  });

  describe('hasAnyError()', function() {
    it('should return false if empty', function() {
      assert.notOk(errorHandler.hasAnyError());
    });

    it('should return true if not empty', function() {
      errorHandler.add(error);
      assert.ok(errorHandler.hasAnyError());
    });
  });

  describe('hasAnyErrorWithoutFileNameSet()', function() {
    it('should return true if an error has no fileName set', function() {
      errorHandler.add(error);
      error.fileName = 'fileName';
      errorHandler.add(new Error('message'));
      assert.ok(errorHandler.hasAnyErrorWithoutFileNameSet());
    });

    it('should return false every error has a fileName', function() {
      error.fileName = 'fileName';
      var secondError = new ParserError('message');
      secondError.fileName = 'second File Name';

      errorHandler.add(error);
      errorHandler.add(secondError);

      assert.notOk(errorHandler.hasAnyErrorWithoutFileNameSet());
    });
  });

  describe('setFileNameIfNotSet()', function() {
    it('should set file name', function() {
      errorHandler.add(error);
      errorHandler.setFileNameIfNotSet('testFile');
      assert.equal(error.fileName, 'testFile');
    });

    it('should not change the file name if already set', function() {
      errorHandler.add(error);
      errorHandler.setFileNameIfNotSet('testFile');
      errorHandler.setFileNameIfNotSet('newName');
      assert.equal(error.fileName, 'testFile');
    });

    it('should modify multiple errors', function() {
      var errors = [new Error(), new Error()];

      errors.forEach(function(error) {
        errorHandler.add(error);
      });

      errorHandler.setFileNameIfNotSet('testFile');

      errorHandler.errors.forEach(function(error) {
        assert.equal(error.fileName, 'testFile');
      });
    });

    it('should only modify the errors that do not have file name set', function() {
      errorHandler.add(error);
      errorHandler.setFileNameIfNotSet('testFile');

      var secondError = new ParserError();
      errorHandler.add(secondError);
      errorHandler.setFileNameIfNotSet('otherName');
      assert.equal(error.fileName, 'testFile');
      assert.equal(secondError.fileName, 'otherName');
    });
  });
});
