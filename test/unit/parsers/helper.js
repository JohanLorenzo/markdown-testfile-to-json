'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var rewire = require('rewire');
var helper = rewire('../../../lib/parsers/helper');

describe('The helper parser', function () {

  var errorHandlerMock = {
    add: function() {}
  };
  helper.__set__('errorHandler', errorHandlerMock);
  var addMock = sinon.stub(errorHandlerMock, 'add');

  afterEach(function() {
    addMock.reset();
  });

  describe('sortTokensByHierarchy()', function() {

    var tokens;

    it('should create a new sorted token if the type matches', function() {
      tokens = [{
        type: 'paragraph',
        text: 'name'
      }];

      var results = helper.sortTokensByHierarchy(tokens, 'paragraph');
      assert.deepEqual(results, [{
        name: 'name',
        childrenTokens: []
      }]);
    });

    it('should create a new sorted token if the type and the level match', function() {
      tokens = [{
        type: 'heading',
        depth: 1,
        text: 'name'
      }];

      var results = helper.sortTokensByHierarchy(tokens, 'heading', 1);
      assert.deepEqual(results, [{
        name: 'name',
        childrenTokens: []
      }]);
    });

    it('should append to the last token if the type does not match', function() {
      tokens = [{
        type: 'heading',
        depth: 1,
        text: 'name'
      },{
        type: 'paragraph',
        text: 'text'
      }];

      var results = helper.sortTokensByHierarchy(tokens, 'heading', 1);
      assert.deepEqual(results, [{
        name: 'name',
        childrenTokens: [{
          type: 'paragraph',
          text: 'text'
        }]
      }]);
    });

    it('should add an error if no last token exist', function() {
      tokens = [{
        type: 'paragraph',
        text: 'text'
      }];

      helper.sortTokensByHierarchy(tokens, 'heading', 1);
      sinon.assert.calledWith(addMock, new Error('"paragraph" with the text "text" should not be before a "heading"'));
    });
  });
});
