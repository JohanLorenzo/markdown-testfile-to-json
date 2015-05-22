'use strict';

function ParserError(message, fileName, lineNumber) {
  // Error does not support standard inheritance
  Error.call(this);
  this.message = message;
  this.fileName = fileName;
  this.lineNumber = lineNumber;
}

ParserError.prototype = Object.create(Error.prototype);

ParserError.prototype.toString = function() {
  return this.fileName + ': ' + this.message;
};

ParserError.prototype.isFileNameDefined = function() {
  return typeof this.fileName !== 'undefined';
};

module.exports = ParserError;
