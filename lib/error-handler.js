'use strict';

var errors = [];

exports.clearErrors = function() {
  errors.length = 0;
};

exports.hasAnyError = function() {
  return errors.length > 0;
};

exports.add = function(error) {
  // TODO Check the content of error
  _replaceDefaultToString(error);
  errors.push(error);
};

exports.setFileNameIfNotSet = function(fileName) {
  errors = errors.map(function(error) {
    if (typeof error.fileName === 'undefined') {
      error.fileName = fileName;
    }
    return error;
  });
};

function _replaceDefaultToString(error) {
  error.toString = _errorToString.bind(error);
}

function _errorToString() {
  /*jshint validthis: true */
  return this.fileName + ': ' + this.message;
}

exports.errors = errors;
exports._errorToString = _errorToString;
exports._replaceDefaultToString = _replaceDefaultToString;
