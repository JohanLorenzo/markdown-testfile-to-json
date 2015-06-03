'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var rewire = require('rewire');
var suiteParse = rewire('../../../lib/parsers/suite');

describe('suiteParse', function() {

  var parseTestcaseMock = sinon.stub();
  var SuiteMock = sinon.stub();
  var helperMock = {
    sortTokensByHierarchy: sinon.stub()
  };
  helperMock.sortTokensByHierarchy.returns([]);

  var errorHandlerMock = {
    add: function() {}
  };

  suiteParse.__set__("parseTestcase", parseTestcaseMock);
  suiteParse.__set__("Suite", SuiteMock);
  suiteParse.__set__("helper", helperMock);
  suiteParse.__set__('errorHandler', errorHandlerMock);
  var addMock = sinon.stub(errorHandlerMock, 'add');

  afterEach(function() {
    parseTestcaseMock.reset();
    helperMock.sortTokensByHierarchy.reset();
    SuiteMock.reset();
    addMock.reset();
  });

  describe('_getTestcaseVariablesFromRow()', function() {
    var _getTestcaseVariablesFromRow = suiteParse.__get__('_getTestcaseVariablesFromRow');

    var header;
    var row;

    it('should add a variable if there is an x', function() {
      header = ['', 'var1'];
      row = ['testcaseId', 'x'];
      assert.deepEqual(_getTestcaseVariablesFromRow(row, header), ['var1']);
    });

    it('should not add a variable if there is no x', function() {
      header = ['', 'var1'];
      row = ['testcaseId', ''];
      assert.deepEqual(_getTestcaseVariablesFromRow(row, header), []);
    });

    it('should trim the cell content', function() {
      header = ['', 'var1'];
      row = ['testcaseId', '  x '];
      assert.deepEqual(_getTestcaseVariablesFromRow(row, header), ['var1']);
    });

    it('should handle multiple colums', function() {
      header = ['', 'var1', 'var2'];
      row = ['testcaseId', '', 'x'];
      assert.deepEqual(_getTestcaseVariablesFromRow(row, header), ['var2']);
    });

    it('should ignore the first column', function() {
      header = ['fakeVar'];
      row = ['x'];
      assert.deepEqual(_getTestcaseVariablesFromRow(row, header), []);
    });

    it('should add an error if there are more columns on a row than on the header', function() {
      header = ['', 'var1'];
      row = ['testcaseId', '', ''];
      _getTestcaseVariablesFromRow(row, header);
      sinon.assert.calledOnce(addMock);
    });

    it('should add an error if there is some content that is not valid', function() {
      header = ['', 'var1'];
      row = ['testcaseId', 'invalidContent'];
      _getTestcaseVariablesFromRow(row, header);
      sinon.assert.calledOnce(addMock);
    });

  });

  describe('_getSuiteVariablesFromTable()', function() {
    var _getSuiteVariablesFromTable = suiteParse.__get__('_getSuiteVariablesFromTable');

    var _getTestcaseVariablesFromRowStub = sinon.stub();
    _getTestcaseVariablesFromRowStub.returns(['var1']);
    suiteParse.__set__('_getTestcaseVariablesFromRow', _getTestcaseVariablesFromRowStub);

    afterEach(function() {
      _getTestcaseVariablesFromRowStub.reset();
    });

    it('should map a testcaseId to the variables', function() {
      _getTestcaseVariablesFromRowStub.returns(['var1']);
      var token = {
        cells: [
          ['testcaseId', 'x']
        ]
      };
      assert.deepEqual(_getSuiteVariablesFromTable(token), {
        'testcaseId': ['var1']
      });
    });

    it('should handle multiple rows', function() {
      var token = {
        cells: [
          ['testcaseId', 'x'],
          ['testcaseId2', 'x']
        ]
      };
      assert.deepEqual(_getSuiteVariablesFromTable(token), {
        'testcaseId': ['var1'],
        'testcaseId2': ['var1']
      });
    });

    it('should add an error if a testId has already been used in the table', function() {
      var token = {
        cells: [
          ['testcaseId', 'x'],
          ['testcaseId', 'x']
        ]
      };
      _getSuiteVariablesFromTable(token);
      sinon.assert.calledOnce(addMock);
    });

  });

  describe('the main function', function() {

    var token;

    var _getSuiteVariablesFromTableStub = sinon.stub();
    _getSuiteVariablesFromTableStub.returns(['var1']);
    suiteParse.__set__('_getSuiteVariablesFromTable', _getSuiteVariablesFromTableStub);

    it('should pass the name of the suite', function() {
      token = {
        name: 'A suite',
        childrenTokens: []
      };
      suiteParse(token);
      sinon.assert.calledWith(SuiteMock, 'A suite');
    });

    it('should pass the testcases of the suite', function() {
      var children = ['child1', 'child2'];
      token = {
        name: 'A suite',
        childrenTokens: children
      };
      helperMock.sortTokensByHierarchy.returns(children);
      parseTestcaseMock.onCall(0).returns(children[0]);
      parseTestcaseMock.onCall(1).returns(children[1]);

      suiteParse(token);
      sinon.assert.calledWith(SuiteMock, 'A suite', children);
    });

    it('should sort the children tokens by heading', function() {
      token = {
        childrenTokens: ['child']
      };
      suiteParse(token);
      sinon.assert.calledWith(helperMock.sortTokensByHierarchy, token.childrenTokens, 'heading', 2);
    });

    it('should delegate the parsing of the children tokens to parseTestCase', function() {
      helperMock.sortTokensByHierarchy.returns(['child1', 'child2']);
      suiteParse(token);
      sinon.assert.calledTwice(parseTestcaseMock);
    });

    it("should handle the table if it's the first child token", function() {
      var children = [{type: 'table'}, 'child2'];
      var nonTableChildren = [children[1]];

      token = {
        name: 'A suite',
        childrenTokens: children
      };

      var suiteVars = {testcaseId: ['var1']};
      _getSuiteVariablesFromTableStub.returns(suiteVars);

      helperMock.sortTokensByHierarchy.returns(nonTableChildren);
      parseTestcaseMock.onCall(0).returns(nonTableChildren[0]);

      suiteParse(token);
      sinon.assert.calledWith(SuiteMock, 'A suite', nonTableChildren, suiteVars);
    });
  });

  describe('_isFirstTokenTable()', function() {
    var _isFirstTokenTable = suiteParse.__get__('_isFirstTokenTable');

    it('should return true if the first token is a table', function() {
      assert.ok(_isFirstTokenTable([{
        type: 'table'
      }]));
    });

    it('should return false if the first token is not a table', function() {
      assert.notOk(_isFirstTokenTable([{
        type: 'heading'
      }, {
        type: 'table'
      }]));
    });

    it('should return false if there are no tokens', function() {
      assert.notOk(_isFirstTokenTable([]));
    });
  });

});
