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

  it('should read a file', function(done) {
    mainPackage('filePath').then(function() {
      check(done, function() {
        sinon.assert.calledWith(readFileStub, 'filePath');
      });
    });
  });

  it('should parse the file given', function(done) {
    mainPackage('filePath').then(function() {
      check(done, function() {
        sinon.assert.calledWith(parseMarkdownStub, 'fileText');
      });
    });
  });

  it('should set the file name if there are errors in the handler', function(done) {
    errorHandlerMock.hasAnyError.returns(true);

    mainPackage('filePath').catch(function() {
      check(done, function() {
        sinon.assert.calledWith(errorHandlerMock.setFileNameIfNotSet, 'filePath');
      });
    });

  });

  it('should reject the promise if there are errors in the handler', function(done) {
    errorHandlerMock.hasAnyError.returns(true);
    mainPackage('filePath').catch(function() {
      check(done, function() {
        assert.ok(true);
      });
    });
  });

  it('should contain the errors if the promise is rejected', function(done) {
    errorHandlerMock.hasAnyError.returns(true);
    mainPackage('filePath').catch(function(errors) {
      check(done, function() {
        assert.equal(errors, errorHandlerMock.errors);
      });
    });
  });

  it('should resolve the promise with the json parsed if no error', function(done) {
    errorHandlerMock.hasAnyError.returns(false);
    mainPackage('filePath').then(function() {
      check(done, function() {
        assert.ok(true);
      });
    });
  });

  it('should contain the json if the promise is resolved', function(done) {
    errorHandlerMock.hasAnyError.returns(false);
    mainPackage('filePath').then(function(json) {
      check(done, function() {
        assert.equal(json, 'json');
      });
    });
  });
});


function check(done, f) {
  try {
    f();
    done();
  } catch (e) {
    done(e);
  }
}
