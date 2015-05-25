'use strict';

var ParserError = require('./parser-error');

var errors = [];

exports.clearErrors = function() {
  errors.length = 0;
};

exports.hasAnyError = function() {
  return errors.length > 0;
};

exports.hasAnyErrorWithoutFileNameSet = function() {
  return !errors.every(function(error) {
    return error.isFileNameDefined();
  });
};

exports.add = function(error) {
  if (!(error instanceof ParserError)) {
    error = new ParserError(error.message, error.fileName, error.lineNumber);
  }

  errors.push(error);
};

exports.setFileNameIfNotSet = function(fileName) {
  errors = errors.map(function(error) {
    if (!error.isFileNameDefined()) {
      error.fileName = fileName;
    }
    return error;
  });
};

exports.errors = errors;
