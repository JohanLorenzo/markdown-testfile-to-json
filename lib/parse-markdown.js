'use strict';

var marked = require('marked');

var _getArrayElementSafely = function(index, array) {
  return index < array.length ? array[index] : null;
};

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
    } else {
      check.state = decorator;
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

module.exports = function(text){
  var checks = [];

  var lexer = new marked.Lexer();
  var tokens = lexer.lex(text);

  for (var i = 0; i < tokens.length;) {
    var token = _getArrayElementSafely(i, tokens);

    if (token && token.type === 'heading' && token.depth === 3) {
      var check = {
        id: token.text
      };

      token = _getArrayElementSafely(++i, tokens);

      while (token && (token.type === 'paragraph' || token.type === 'table')) {
        if (token.type === 'paragraph') {
          _handleParagraph(check, token);
        } else {
          _handleTable(check, token);
        }
        token = _getArrayElementSafely(++i, tokens);
      }
      checks.push(check);
    } else {
      i++;
    }
  }

  return checks;
};
