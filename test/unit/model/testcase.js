'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var rewire = require('rewire');
var Testcase = rewire('../../../lib/model/testcase');

describe('Testcase parser', function () {

  var errorHandlerMock = {
    add: function() {}
  };
  Testcase.__set__('errorHandler', errorHandlerMock);
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
      var id = 'id';
      var instructions = 'instructions';
      var state = 'active';
      var bugNumber = 1;
      var userStory = 1;
      var variables = 'variables';

      var testcase = new Testcase(id, instructions, state, bugNumber, userStory, variables);
      assert.equal(testcase.id, id);
      assert.equal(testcase.instructions, instructions);
      assert.equal(testcase.state, state);
      assert.equal(testcase.bug, bugNumber);
      assert.equal(testcase.userStory, userStory);
      assert.equal(testcase.variables, variables);
    });

    it('should enforce the presence of the ID', function() {
      new Testcase(object.undefinedId);
      sinon.assert.calledOnce(addMock);
    });

    it('should enforce the presence of the instructions', function() {
      new Testcase('id', object.undefinedInstructions);
      sinon.assert.calledOnce(addMock);
    });

    it('should set the state to "active" if undefined', function() {
      var testcase = new Testcase('id', 'instructions');
      assert.equal(testcase.state, 'active');
    });

    it('should not set the bug number if undefined', function() {
      var testcase = new Testcase('id', 'instructions');
      assert.isUndefined(testcase.bug);
    });

    it('should not set the user story number if undefined', function() {
      var testcase = new Testcase('id', 'instructions');
      assert.isUndefined(testcase.userStory);
    });

    it('should not set the variables if undefined', function() {
      var testcase = new Testcase('id', 'instructions');
      assert.isUndefined(testcase.variables);
    });
  });

  describe('isValidState()', function() {
    it('should return true for a given set of states', function() {
      var states = ['active', 'draft', 'disabled', 'xfail'];

      states.forEach(function(state) {
        assert.ok(Testcase.isValidState(state));
      });
    });

    it('should return false for an other value', function() {
      assert.notOk(Testcase.isValidState('invalidState'));
    });
  });

  describe('_sanitizeId()', function() {
    it('should return the ID passed', function() {
      assert.strictEqual(Testcase._sanitizeId('testcase'), 'testcase');
    });

    it('should trim the given string', function() {
      assert.strictEqual(Testcase._sanitizeId('testcase '), 'testcase');
    });

    it('should accept dots', function() {
      assert.strictEqual(Testcase._sanitizeId('fxos.test'), 'fxos.test');
    });

    it('should accept underscores', function() {
      assert.strictEqual(Testcase._sanitizeId('my_test'), 'my_test');
    });

    it('should add an error if a string is not given', function() {
      Testcase._sanitizeId(1);
      sinon.assert.calledWith(addMock, new Error('"1" should contains only letters, dots, and underscores'));
    });

    it('should add an error if there is a space in the middle', function() {
      Testcase._sanitizeId('fxos test');
      sinon.assert.calledWith(addMock, new Error('"fxos test" should contains only letters, dots, and underscores'));
    });
  });

  describe('_sanitizeString()', function() {
    it('should return the string passed', function() {
      assert.strictEqual(Testcase._sanitizeString('fxos.test'), 'fxos.test');
    });

    it('should add an error if a string is not given', function() {
      Testcase._sanitizeString(1);
      sinon.assert.calledWith(addMock, new Error('"1" must be a string'));
    });
  });

  describe('_sanitizePositiveInteger()', function() {
    it('should return the number passed', function() {
      assert.strictEqual(Testcase._sanitizePositiveInteger(1), 1);
    });

    it('should convert a number from a string', function() {
      assert.strictEqual(Testcase._sanitizePositiveInteger("1"), 1);
    });

    it('should add an error if a negative integer is given', function() {
      Testcase._sanitizePositiveInteger("-1");
      sinon.assert.calledWith(addMock, new Error('"-1" must be a positive finite integer'));
    });

    it('should add an error if decimal number is given', function() {
      Testcase._sanitizePositiveInteger("1.0");
      sinon.assert.calledWith(addMock, new Error('"1.0" must be a positive finite integer'));
    });

    it('should add an error if a non-interger is given', function() {
      Testcase._sanitizePositiveInteger("1.1");
      sinon.assert.calledWith(addMock, new Error('"1.1" must be a positive finite integer'));
    });
  });

  describe('_sanitizeState()', function() {
    it('should return the value if the state a is a valid one', function() {
      assert.strictEqual(Testcase._sanitizeState('active'), 'active');
    });

    it('should call isValidState()', function() {
      sinon.spy(Testcase, 'isValidState');
      Testcase._sanitizeState('active');
      assert(Testcase.isValidState.calledWith('active'));
    });

    it('should add an error if the state is not a valid one', function() {
      Testcase._sanitizeState('invalidState');
      sinon.assert.calledWith(addMock, new Error('"invalidState" is not a valid state'));
    });
  });

  describe('_isOptionalFieldDefined', function() {
    it('should return true when called with an argument', function() {
      assert.ok(Testcase._isOptionalFieldDefined(''));
    });

    it('should return false when called with no argument', function() {
      assert.notOk(Testcase._isOptionalFieldDefined());
    });

    it('should return false when called with an argument set to undefined', function() {
      var object = {};
      assert.notOk(Testcase._isOptionalFieldDefined(object.undefinedArgument));
    });
  });

});
