'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var rewire = require('rewire');
var Suite = rewire('../../../lib/model/suite');

describe('Suite', function () {

  var errorHandlerMock = {
    add: function() {}
  };
  Suite.__set__('errorHandler', errorHandlerMock);
  var addMock = sinon.stub(errorHandlerMock, 'add');

  afterEach(function() {
    addMock.reset();
  });


  describe('the constructor', function() {
    var object;

    beforeEach(function() {
      object = {};
    });

    it('should accept all attributes', function() {
      var name = 'name';
      var testcases = ['testcase1', 'testcase2'];
      var variables = 'variables';

      var suite = new Suite(name, testcases, variables);
      assert.equal(suite.name, name);
      assert.deepEqual(suite.testcases, testcases);
      assert.equal(suite.variables, variables);
    });

    it('should enforce the presence of the name', function() {
      new Suite(object.undefinedName);
      sinon.assert.calledWith(addMock, new Error('"undefined" must be a string'));
    });

    it('should enforce the presence of the testcases', function() {
      new Suite('name', object.undefinedInstructions);
      sinon.assert.calledWith(addMock, new Error('There are no test cases defined.'));
    });

    it('should not set the variables if undefined', function() {
      var suite = new Suite('name', 'instructions');
      assert.isUndefined(suite.variables);
    });
  });


  describe('_sanitizeName()', function() {
    it('should return the string passed', function() {
      assert.strictEqual(Suite._sanitizeName('A suite'), 'A suite');
    });

    it('should trim the given string', function() {
      assert.strictEqual(Suite._sanitizeName('  A suite '), 'A suite');
    });

    it('should add an error if a string is not given', function() {
      Suite._sanitizeName(1);
      sinon.assert.calledWith(addMock, new Error('"1" must be a string'));
    });
  });

  describe('_sanitizeTestcases()', function() {
    it('should return the array passed', function() {
      assert.deepEqual(Suite._sanitizeTestcases(['testcase1', 'testcase2']), ['testcase1', 'testcase2']);
    });

    it('should add an error if the array is empty', function() {
      Suite._sanitizeTestcases([]);
      sinon.assert.calledWith(addMock, new Error('There are no test cases defined.'));
    });

    it('should add an error if no array is given', function() {
      Suite._sanitizeTestcases();
      sinon.assert.calledWith(addMock, new Error('There are no test cases defined.'));
    });
  });
});
