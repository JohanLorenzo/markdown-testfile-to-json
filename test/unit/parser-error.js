'use strict';

var ParserError = require('../../lib/parser-error');
var assert = require('chai').assert;

describe('ParserError', function() {

  describe('toString()', function() {
    it('should format the string to contain fileName: errorMessage', function() {
      var error = new ParserError('errorMessage');
      error.fileName = 'file_name';
      assert.equal(error.toString(), 'file_name: errorMessage');
    });
  });

  describe('isFileNameDefined()', function() {
    it('should return true if defined', function() {
      var error = new ParserError('errorMessage', 'file_name');
      assert.ok(error.isFileNameDefined());
    });

    it('should return false if not defined', function() {
      var error = new ParserError('errorMessage');
      assert.notOk(error.isFileNameDefined());
    });
  });


});
