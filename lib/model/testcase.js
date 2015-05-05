'use strict';

var VALID_STATES = 'active draft disabled xfail'.split(' ');

function Testcase(id, instructions, state, bug, userStory, variables) {

  this.id = Testcase.sanitizeId(id);
  this.instructions = instructions;

  this.state = _isOptionalFieldDefined(state) ? Testcase.sanitizeState(state) : VALID_STATES[0];
  if (_isOptionalFieldDefined(bug)) { this.bug = Testcase.sanitizeInteger(bug); }
  if (_isOptionalFieldDefined(userStory)) { this.userStory = Testcase.sanitizeInteger(userStory); }
  if (_isOptionalFieldDefined(variables)) { this.variables = variables; }
}

Testcase.sanitizeId = function(candidate) {
  if (typeof candidate !== 'string') {
    throw new Error('id must be a string');
  }
  // TODO Check the dots and the underscores
  return candidate;
};

Testcase.sanitizeInteger = function(candidate) {
  var value = parseInt(candidate, 10);

  if (isNaN(value)) {
    throw new Error(candidate + ' must be an integer');
  }
  if (value < 0) {
    throw new Error(candidate + ' must be positive');
  }
  return value;
};

Testcase.sanitizeState = function(candidate) {
  if (!this.isValidState(candidate)) {
    throw new Error(candidate + ' is not a valid state');
  }
  return candidate;
};

Testcase.isValidState = function(candidate) {
  return VALID_STATES.indexOf(candidate) !== -1;
};

function _isOptionalFieldDefined(candidate) {
  return typeof candidate !== 'undefined';
}

module.exports = Testcase;
