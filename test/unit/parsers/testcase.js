'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var rewire = require("rewire");

var TESTCASE_PARSER_PATH = '../../../lib/parsers/testcase';
var TestcaseParser = require(TESTCASE_PARSER_PATH);

describe('TestcaseParser', function () {

  var testcaseNotSanitized;

  beforeEach(function() {
    testcaseNotSanitized = {};
  });

  describe('parse()', function() {
    var testcaseSpy;
    var token;

    before(function() {
      TestcaseParser = rewire(TESTCASE_PARSER_PATH);

      function TestcaseMock() {}
      testcaseSpy = sinon.spy(TestcaseMock);
      TestcaseParser.__set__("Testcase", testcaseSpy);

      sinon.spy(TestcaseParser, '_handleParagraph');
      sinon.spy(TestcaseParser, '_handleTable');
    });

    beforeEach(function() {
      testcaseSpy.reset();
      TestcaseParser._handleParagraph.reset();
      TestcaseParser._handleTable.reset();
    });

    after(function() {
      TestcaseParser = require(TESTCASE_PARSER_PATH);
    });

    it('should return a Testcase', function() {
      token = {
        name: '',
        childrenTokens: []
      };
      var testcase = TestcaseParser.parse(token);
      assert.isDefined(testcase);
      assert.ok(testcaseSpy.called);
    });

    it('should initialize the id', function() {
      token = {
        name: 'id',
        childrenTokens: []
      };
      TestcaseParser.parse(token);
      assert.ok(testcaseSpy.calledWith('id'));
    });

    it('should call _handleParagraph() if a paragraph is a following token', function() {
      token = {
        childrenTokens: [{
          type: 'paragraph',
          text: 'text'
        }]
      };

      TestcaseParser.parse(token);
      assert.ok(TestcaseParser._handleParagraph.calledOnce);
    });

    it('should call _handleTable() if a table is a following token', function() {
      token = {
        childrenTokens: [{
          type: 'table',
          header: ['text'],
          cells: [['']]
        }]
      };

      TestcaseParser.parse(token);
      assert.ok(TestcaseParser._handleTable.calledOnce);
    });

    it('should handle multiple following tokens', function() {
      token = {
        childrenTokens: [{
          type: 'paragraph',
          text: 'text'
        },{
          type: 'paragraph',
          text: 'text2'
        }]
      };

      TestcaseParser.parse(token);
      assert.ok(TestcaseParser._handleParagraph.calledTwice);
    });

    it('should throw an error if a following token is not supported at this level', function() {
      token = {
        childrenTokens: [{
          type: 'header'
        }]
      };

      assert.throws(function() { TestcaseParser.parse(token); }, Error, '"header" is not supported in test cases');
    });
  });

  describe('_handleParagraph()', function() {
    it('should call _handleDecorators() if ` was found', function() {
      var decoratorsParagraph = '`bug 1`';
      var token = { text: decoratorsParagraph };
      sinon.spy(TestcaseParser, '_handleDecorators');

      TestcaseParser._handleParagraph(testcaseNotSanitized, token);

      assert(TestcaseParser._handleDecorators
        .calledWith(testcaseNotSanitized, decoratorsParagraph.split('`')));
    });

    it('should attach the instructions if no ` was found', function() {
      var instructions = 'Do some testing';
      var token = { text: instructions };
      TestcaseParser._handleParagraph(testcaseNotSanitized, token);
      assert.strictEqual(testcaseNotSanitized.instructions, instructions);
    });
  });

  describe('_handleTable()', function() {
    it('should attach the variables', function() {
      var token = {
        header: ['key'],
        cells: [['value']]
      };

      TestcaseParser._handleTable(testcaseNotSanitized, token);
      assert.deepEqual(testcaseNotSanitized.variables, [
        { key: 'value' }
      ]);
    });

    it('should support multiple values for the same key', function() {
      var token = {
        header: ['key'],
        cells: [['value1'], ['value2']]
      };

      TestcaseParser._handleTable(testcaseNotSanitized, token);
      assert.deepEqual(testcaseNotSanitized.variables, [
        { key: 'value1' },
        { key: 'value2' }
      ]);
    });

    it('should support multiple keys', function() {
      var token = {
        header: ['key1', 'key2'],
        cells: [['value11', 'value12']]
      };

      TestcaseParser._handleTable(testcaseNotSanitized, token);
      assert.deepEqual(testcaseNotSanitized.variables, [
        { key1: 'value11', key2: 'value12' }
      ]);
    });

    it('should support multiple keys and values', function() {
      var token = {
        header: ['key1', 'key2'],
        cells: [['value11', 'value12'], ['value21', 'value22']]
      };

      TestcaseParser._handleTable(testcaseNotSanitized, token);
      assert.deepEqual(testcaseNotSanitized.variables, [
        { key1: 'value11', key2: 'value12' },
        { key1: 'value21', key2: 'value22' }
      ]);
    });
  });

  describe('_handleDecorator()', function() {
    it('should attach the bug number', function() {
      TestcaseParser._handleDecorators(testcaseNotSanitized, ['bug 1']);
      assert.strictEqual(testcaseNotSanitized.bug, '1');
    });

    it('should attach the user story number', function() {
      TestcaseParser._handleDecorators(testcaseNotSanitized, ['story 2']);
      assert.strictEqual(testcaseNotSanitized.userStory, '2');
    });

    it('should attach the state of the bug', function() {
      TestcaseParser._handleDecorators(testcaseNotSanitized, ['xfail']);
      assert.strictEqual(testcaseNotSanitized.state, 'xfail');
    });

    it('should handle multiple decorators', function() {
      TestcaseParser._handleDecorators(testcaseNotSanitized, ['bug 1', 'story 2']);
      assert.strictEqual(testcaseNotSanitized.bug, '1');
      assert.strictEqual(testcaseNotSanitized.userStory, '2');
    });

    it('should trim the values', function() {
      TestcaseParser._handleDecorators(testcaseNotSanitized, [' bug 1 ']);
      assert.strictEqual(testcaseNotSanitized.bug, '1');
    });

    it('should exclude the blank lines', function() {
      assert.doesNotThrow(function() {
        TestcaseParser._handleDecorators(testcaseNotSanitized, ['\n']);
      }, Error);
    });

    it('should throw an error if the decorator is not supported', function() {
      assert.throws(function() {
        TestcaseParser._handleDecorators(testcaseNotSanitized, ['invalidDecorator']);
      }, Error, '"invalidDecorator" is not a supported decorator.');
    });

    it('should throw an error if there is no space between "bug" and the number', function() {
      assert.throws(function() {
        TestcaseParser._handleDecorators(testcaseNotSanitized, ['bug1']);
      }, Error, '"bug1" is not a supported decorator.');
    });

    it('should throw an error if "bug" is not the first word', function() {
      assert.throws(function() {
        TestcaseParser._handleDecorators(testcaseNotSanitized, ['fake bug 1']);
      }, Error, '"fake bug 1" is not a supported decorator.');
    });

    it('should throw an error if "bug" is not in lowercase', function() {
      assert.throws(function() {
        TestcaseParser._handleDecorators(testcaseNotSanitized, ['Bug 1']);
      }, Error, '"Bug 1" is not a supported decorator.');
    });

    it('should throw an error if "bug" is not a single word', function() {
      assert.throws(function() {
        TestcaseParser._handleDecorators(testcaseNotSanitized, ['bugzilla 1']);
      }, Error, '"bugzilla 1" is not a supported decorator.');
    });

    // TODO, this edge case is currently not supported.
    // it('should throw an error if a value is already assigned', function() {
    //
    // });
  });
});
