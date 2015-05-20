'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var errorHandler = require('../../lib/error-handler');

describe('errorHandler', function() {

  var error;

  beforeEach(function(){
    errorHandler.clearErrors();
    error = new Error('error message');
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

    // FIXME: errorHandler._replaceDefaultToString doesn't seem to be called
    it.skip('should replace the default toString() method', function() {
      sinon.spy(errorHandler, '_replaceDefaultToString');
      errorHandler.add(error);
      // FIXME: sinon.assert.calledWith(errorHandler._replaceDefaultToString, error); does a toString() on the error object
      sinon.assert.calledOnce(errorHandler._replaceDefaultToString);
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

      errors.forEach(function(error) {
        assert.equal(error.fileName, 'testFile');
      });
    });

    it('should only modify the errors that do not have file name set', function() {
      errorHandler.add(error);
      errorHandler.setFileNameIfNotSet('testFile');

      var secondError = new Error();
      errorHandler.add(secondError);
      errorHandler.setFileNameIfNotSet('otherName');
      assert.equal(error.fileName, 'testFile');
      assert.equal(secondError.fileName, 'otherName');
    });
  });

  describe('_replaceDefaultToString()', function() {
    it('should change toString() by _errorToString()', function() {
      var expectedError = new Error('error message');
      expectedError.toString = errorHandler._errorToString.bind(expectedError);
      errorHandler._replaceDefaultToString(error);
      assert.equal(error.toString(), expectedError.toString());
    });
  });

  describe('_errorToString()', function() {
    it('should format the string to contain fileName: errorMessage', function() {
      error.fileName = 'file_name';
      error.toString = errorHandler._errorToString.bind(error);
      assert.equal(error.toString(), 'file_name: error message');
    });
  });
});
