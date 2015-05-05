'use strict';

var Testcase = require('../model/testcase');

var _parseDecorators = function(rawValues) {
  var decorators = [];

  for(var i = 0; i < rawValues.length; i++) {
    var value = rawValues[i].trim();
    if (value !== '') {
      decorators.push(value);
    }
  }

  return decorators;
};

var _handleDecorators = function(check, rawValues) {
  var decorators = _parseDecorators(rawValues);

  decorators.forEach(function(decorator) {
    decorator = decorator.toLowerCase();

    if (decorator.indexOf('bug') > -1) {
      check.bug = decorator.replace('bug', '').trim();
    } else if (decorator.indexOf('story') > -1) {
      check.userStory = decorator.replace('story', '').trim();
    } else if (Testcase.isValidState(decorator)){
      check.state = decorator;
    } else {
      throw new Error(decorator + ' is not a supported decorator.');
    }
  });
};

var _handleParagraph = function(check, token) {
  var values = token.text.split('`');
  if (values.length > 1) {
    _handleDecorators(check, values);
  } else {
    check.instructions = token.text;
  }
};

var _handleTable = function(check, token) {
  var array = [];

  token.cells.forEach(function(row) {
    var obj = {};
    for (var i = 0; i < token.header.length; i++) {
      obj[token.header[i]] = row[i];
    }
    array.push(obj);
  });

  check.variables = array;
};


module.exports = function(sortedToken) {
  var testcase = {
    id: sortedToken.name
  };

  sortedToken.followingTokens.forEach(function(token) {
    if (token.type === 'paragraph') {
      _handleParagraph(testcase, token);
    } else if (token.type === 'table') {
      _handleTable(testcase, token);
    } else {
      throw new Error(token.type + ' is not supported in test cases');
    }
  });


  return new Testcase(testcase.id, testcase.instructions, testcase.state, testcase.bug, testcase.userStory, testcase.variables);
};
