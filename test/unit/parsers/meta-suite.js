'use strict';

var sinon = require('sinon');
var rewire = require('rewire');
var metaSuiteParse = rewire('../../../lib/parsers/meta-suite');

describe('metaSuiteParse', function () {

  var parseSuiteMock = sinon.stub();
  var MetaSuiteMock = sinon.stub();
  var helperMock = {
    sortTokensByHierarchy: sinon.stub()
  };
  helperMock.sortTokensByHierarchy.returns([]);

  metaSuiteParse.__set__("parseSuite", parseSuiteMock);
  metaSuiteParse.__set__("MetaSuite", MetaSuiteMock);
  metaSuiteParse.__set__("helper", helperMock);

  afterEach(function() {
    parseSuiteMock.reset();
    helperMock.sortTokensByHierarchy.reset();
    MetaSuiteMock.reset();
  });

  describe('the main function', function() {

    var token;

    it('should pass the name of the suite', function() {
      token = {
        name: 'A suite',
      };
      metaSuiteParse(token);
      sinon.assert.calledWith(MetaSuiteMock, 'A suite');
    });

    it('should pass the testcases of the suite', function() {
      var children = ['child1', 'child2'];
      token = {
        name: 'A suite',
        childrenTokens: children
      };
      helperMock.sortTokensByHierarchy.returns(children);
      parseSuiteMock.onCall(0).returns(children[0]);
      parseSuiteMock.onCall(1).returns(children[1]);

      metaSuiteParse(token);
      sinon.assert.calledWith(MetaSuiteMock, 'A suite', children);
    });

    it('should sort the children tokens by heading', function() {
      token = {
        childrenTokens: ['child']
      };
      metaSuiteParse(token);
      sinon.assert.calledWith(helperMock.sortTokensByHierarchy, token.childrenTokens, 'heading', 2);
    });

    it('should delegate the parsing of the children tokens to parseSuite', function() {
      helperMock.sortTokensByHierarchy.returns(['child1', 'child2']);
      metaSuiteParse(token);
      sinon.assert.calledTwice(parseSuiteMock);
    });

  });
});
