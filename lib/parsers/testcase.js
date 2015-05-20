'use strict';

var Testcase = require('../model/testcase');
var errorHandler = require('../error-handler');

var _trim = function(value) {
  return value.trim();
};
var _isNotEmpty = function(value) {
  return value !== '';
};

// The trailing spaces are intentional, they prevent from validating strings like 'bug1' or 'bugs'
var BUG_KEYWORD = 'bug ';
var USER_STORY_KEYWORD = 'story ';

var TestcaseParser = {
  parse: function(sortedToken) {
    var testcaseNotSanitized = {
      id: sortedToken.name
    };

    sortedToken.childrenTokens.forEach(function(token) {
      if (token.type === 'paragraph') {
        TestcaseParser._handleParagraph(testcaseNotSanitized, token);
      } else if (token.type === 'table') {
        TestcaseParser._handleTable(testcaseNotSanitized, token);
      } else {
        errorHandler.add(new Error('"' + token.type + '" is not supported in test cases'));
      }
    });

    return new Testcase(testcaseNotSanitized.id, testcaseNotSanitized.instructions,
      testcaseNotSanitized.state, testcaseNotSanitized.bug, testcaseNotSanitized.userStory,
      testcaseNotSanitized.variables);
  },

  _handleParagraph: function(testcaseNotSanitized, token) {
    var values = token.text.split('`');
    if (values.length > 1) {
      TestcaseParser._handleDecorators(testcaseNotSanitized, values);
    } else {
      testcaseNotSanitized.instructions = token.text;
    }
  },

  _handleTable: function(testcaseNotSanitized, token) {
    var array = [];

    token.cells.forEach(function(row) {
      var obj = {};
      for (var i = 0; i < token.header.length; i++) {
        obj[token.header[i]] = row[i];
      }
      array.push(obj);
    });

    testcaseNotSanitized.variables = array;
  },

  _handleDecorators: function(testcaseNotSanitized, rawValues) {
    var decorators = rawValues.map(_trim).filter(_isNotEmpty);

    decorators.forEach(function(decorator) {
      if (decorator.indexOf(BUG_KEYWORD) === 0) {
        testcaseNotSanitized.bug = decorator.replace(BUG_KEYWORD, '');
      } else if (decorator.indexOf(USER_STORY_KEYWORD) === 0) {
        testcaseNotSanitized.userStory = decorator.replace(USER_STORY_KEYWORD, '');
      } else if (Testcase.isValidState(decorator)) {
        testcaseNotSanitized.state = decorator;
      } else {
        errorHandler.add(new Error('"' + decorator + '" is not a supported decorator.'));
      }
    });
  }
};

module.exports = TestcaseParser;
