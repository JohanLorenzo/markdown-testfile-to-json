'use strict';

var sinon = require('sinon');
var rewire = require('rewire');
var suiteParse = rewire('../../../lib/parsers/suite');

describe('suiteParse', function () {

  var parseTestcaseMock = sinon.stub();
  var SuiteMock = sinon.stub();
  var helperMock = {
    sortTokensByHierarchy: sinon.stub()
  };
  helperMock.sortTokensByHierarchy.returns([]);

  suiteParse.__set__("parseTestcase", parseTestcaseMock);
  suiteParse.__set__("Suite", SuiteMock);
  suiteParse.__set__("helper", helperMock);

  afterEach(function() {
    parseTestcaseMock.reset();
    helperMock.sortTokensByHierarchy.reset();
    SuiteMock.reset();
  });

  describe('the main function', function() {

    var token;

    it('should pass the name of the suite', function() {
      token = {
        name: 'A suite',
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
      sinon.assert.calledWith(helperMock.sortTokensByHierarchy, token.childrenTokens, 'heading', 3);
    });

    it('should delegate the parsing of the children tokens to parseTestCase', function() {
      helperMock.sortTokensByHierarchy.returns(['child1', 'child2']);
      suiteParse(token);
      sinon.assert.calledTwice(parseTestcaseMock);
    });

  });
});
