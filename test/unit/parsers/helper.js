'use strict';

var assert = require('chai').assert;
var helper = require('../../../lib/parsers/helper');

describe('The helper parser', function () {

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

    it('should throw an error if no last token exist', function() {
      tokens = [{
        type: 'paragraph',
        text: 'text'
      }];

      assert.throws(function() { helper.sortTokensByHierarchy(tokens, 'heading', 1); },
        Error, '"paragraph" with the text "text" should not be before a "heading"');
    });
  });
});
