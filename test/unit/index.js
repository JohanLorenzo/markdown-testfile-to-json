var assert = require('chai').assert;
var Promise = require('promise');
var sinon = require('sinon');
var rewire = require('rewire');
var mainPackage = rewire('../../index.js');


describe('the main package', function() {
  var errorHandlerMock = {
    hasAnyError: sinon.stub(),
    setFileNameIfNotSet: sinon.stub(),
    errors: [new Error()]
  };
  mainPackage.__set__('errorHandler', errorHandlerMock);

  var readFileStub = sinon.stub();
  readFileStub.returns(new Promise(function(resolve) {
    resolve('fileText');
  }));
  mainPackage.__set__('readFile', readFileStub);

  var parseMarkdownStub = sinon.stub();
  parseMarkdownStub.returns('json');
  mainPackage.__set__('parseMarkdown', parseMarkdownStub);

  it('should return a promise', function() {
    assert.instanceOf(mainPackage(), Promise);
  });

  it('should read a file', function() {
    return mainPackage('filePath').then(function() {
      sinon.assert.calledWith(readFileStub, 'filePath');
    });
  });

  it('should parse the file given', function() {
    return mainPackage('filePath').then(function() {
      sinon.assert.calledWith(parseMarkdownStub, 'fileText');
    });
  });

  it('should set the file name if there are errors in the handler', function() {
    errorHandlerMock.hasAnyError.returns(true);

    return mainPackage('filePath').catch(function() {
      sinon.assert.calledWith(errorHandlerMock.setFileNameIfNotSet, 'filePath');
    });

  });

  it('should reject the promise if there are errors in the handler', function() {
    errorHandlerMock.hasAnyError.returns(true);
    return mainPackage('filePath').catch(function() {
      assert.ok(true);
    });
  });

  it('should contain the errors if the promise is rejected', function() {
    errorHandlerMock.hasAnyError.returns(true);
    return mainPackage('filePath').catch(function(errors) {
      assert.equal(errors, errorHandlerMock.errors);
    });
  });

  it('should resolve the promise with the json parsed if no error', function() {
    errorHandlerMock.hasAnyError.returns(false);
    return mainPackage('filePath').then(function() {
      assert.ok(true);
    });
  });

  it('should contain the json if the promise is resolved', function() {
    errorHandlerMock.hasAnyError.returns(false);
    return mainPackage('filePath').then(function(json) {
      assert.equal(json, 'json');
    });
  });
});
