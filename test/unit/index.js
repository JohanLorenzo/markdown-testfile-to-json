var assert = require('chai').assert;
var Promise = require('promise');
var sinon = require('sinon');
var rewire = require('rewire');
var mainPackage = rewire('../../index.js');


describe('the main package', function() {
  var defaultArguments = ['filePath'];

  var errorHandlerMock = {
    hasAnyError: sinon.stub(),
    setFileNameIfNotSet: sinon.stub(),
    hasAnyErrorWithoutFileNameSet: sinon.stub(),
    errors: [new Error()]
  };
  mainPackage.__set__('errorHandler', errorHandlerMock);

  describe('the main function', function() {
    it('should return a promise', function() {
      assert.instanceOf(mainPackage(defaultArguments), Promise);
    });

    it('should reject the promise if there are errors in the handler', function() {
      errorHandlerMock.hasAnyError.returns(true);
      return mainPackage(defaultArguments).catch(function() {
        assert.ok(true);
      });
    });

    it('should contain the errors if the promise is rejected', function() {
      errorHandlerMock.hasAnyError.returns(true);
      return mainPackage(defaultArguments).catch(function(errors) {
        assert.equal(errors, errorHandlerMock.errors);
      });
    });

    it('should resolve the promise with the suites if no error', function() {
      errorHandlerMock.hasAnyError.returns(false);
      return mainPackage(defaultArguments).then(function() {
        assert.ok(true);
      });
    });

  });

  describe('_handleSingleFilePath', function() {
    var filePath = 'filePath';

    var readFileStub = sinon.stub();
    readFileStub.returns(new Promise(function(resolve) {
      resolve('fileText');
    }));
    mainPackage.__set__('readFile', readFileStub);

    var parseMarkdownStub = sinon.stub();
    parseMarkdownStub.returns('json');
    mainPackage.__set__('parseMarkdown', parseMarkdownStub);

    var _handleSingleFilePath = mainPackage.__get__('_handleSingleFilePath');


    it('should return a promise', function() {
      assert.instanceOf(mainPackage(defaultArguments), Promise);
    });

    it('should read a file', function() {
      return _handleSingleFilePath(filePath).then(function() {
        sinon.assert.calledWith(readFileStub, 'filePath');
      });
    });

    it('should parse the file given', function() {
      return _handleSingleFilePath(filePath).then(function() {
        sinon.assert.calledWith(parseMarkdownStub, 'fileText');
      });
    });

    it('should set the file name if there are errors in the handler', function() {
      errorHandlerMock.hasAnyErrorWithoutFileNameSet.returns(true);
      return _handleSingleFilePath(filePath).catch(function() {
        sinon.assert.calledWith(errorHandlerMock.setFileNameIfNotSet, 'filePath');
      });
    });

    it('should resolve the promise with the json parsed if no error', function() {
      errorHandlerMock.hasAnyErrorWithoutFileNameSet.returns(false);
      return _handleSingleFilePath(filePath).then(function() {
        assert.ok(true);
      });
    });

    it('should not reject the promise if the previous file failed but not the current one', function() {
      errorHandlerMock.hasAnyErrorWithoutFileNameSet.onFirstCall().returns(true);
      errorHandlerMock.hasAnyErrorWithoutFileNameSet.onSecondCall().returns(false);
      return _handleSingleFilePath(filePath).then(function() {
        _handleSingleFilePath('filePath2');
      }).then(function() {
        assert.ok(true);
      });
    });

    it('should contain the json if the promise is resolved', function() {
      errorHandlerMock.hasAnyErrorWithoutFileNameSet.returns(false);
      return _handleSingleFilePath(filePath).then(function(json) {
        assert.equal(json, 'json');
      });
    });
  });

  describe('_mergeSuites', function() {
    var _mergeSuites = mainPackage.__get__('_mergeSuites');


    it('should not mutate the array given', function() {
      var indenticalSuites = [{
        name: 'Suite 1'
      }, {
        name: 'Suite 1'
      }];
      _mergeSuites(indenticalSuites);
      assert.deepEqual(indenticalSuites, [{
        name: 'Suite 1'
      }, {
        name: 'Suite 1'
      }]);
    });

    it('should return the array as is, if there is only one suite', function() {
      var suites = [{
        name: 'Unique suite'
      }];
      var mergedSuites = _mergeSuites(suites);
      assert.deepEqual(mergedSuites, suites);
    });

    it('should return 1 suite for 2 indentical suites given', function() {
      var indenticalSuites = [{
        name: 'Suite 1'
      }, {
        name: 'Suite 1'
      }];
      var mergedSuites = _mergeSuites(indenticalSuites);
      assert.deepEqual(mergedSuites, [{
        name: 'Suite 1'
      }]);
    });

    it('should merge 2 suites if they have the same name', function() {
      var sameNameSuites = [{
        name: 'Suite 1',
        testcases: [1, 2]
      }, {
        name: 'Suite 1',
        testcases: [3, 4]
      }];
      var mergedSuites = _mergeSuites(sameNameSuites);
      assert.deepEqual(mergedSuites, [{
        name: 'Suite 1',
        testcases: [1, 2, 3, 4]
      }]);
    });

    it('should not merge 2 suites with different names', function() {
      var differentNameSuites = [{
        name: 'Suite 1',
      }, {
        name: 'Suite 2',
      }];
      var mergedSuites = _mergeSuites(differentNameSuites);
      assert.deepEqual(mergedSuites, [{
        name: 'Suite 1',
      }, {
        name: 'Suite 2'
      }]);
    });

    it('should merge 2 suites separated by one in the middle', function() {
      var suites = [{
        name: 'Suite 1',
      }, {
        name: 'Suite 2',
      }, {
        name: 'Suite 1',
      }];
      var mergedSuites = _mergeSuites(suites);
      assert.deepEqual(mergedSuites, [{
        name: 'Suite 1',
      }, {
        name: 'Suite 2'
      }]);
    });
  });
});
