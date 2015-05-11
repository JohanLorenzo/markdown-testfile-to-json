'use strict';

var VALID_STATES = 'active draft disabled xfail'.split(' ');

function Testcase(id, instructions, state, bug, userStory, variables) {

  this.id = Testcase._sanitizeId(id);
  this.instructions = Testcase._sanitizeString(instructions);

  this.state = Testcase._isOptionalFieldDefined(state) ? Testcase._sanitizeState(state) : VALID_STATES[0];
  if (Testcase._isOptionalFieldDefined(bug)) {
    this.bug = Testcase._sanitizePositiveInteger(bug);
  }
  if (Testcase._isOptionalFieldDefined(userStory)) {
    this.userStory = Testcase._sanitizePositiveInteger(userStory);
  }
  if (Testcase._isOptionalFieldDefined(variables)) {
    this.variables = variables;
  }
}

Testcase.isValidState = function(candidate) {
  return VALID_STATES.indexOf(candidate) !== -1;
};

Testcase._sanitizeId = function(candidate) {
  // FIXME Avoid the duplication
  try {
    candidate = candidate.trim();
  } finally {
    if (!/^[A-Za-z_.]+$/.test(candidate)) {
      throw new Error('"' + candidate + '" should contains only letters, dots, and underscores');
    }
    return candidate;
  }
};

Testcase._sanitizeInstructions = function(candidate) {
  return candidate;
};

Testcase._sanitizeState = function(candidate) {
  if (!Testcase.isValidState(candidate)) {
    throw new Error('"' + candidate + '" is not a valid state');
  }
  return candidate;
};

Testcase._sanitizeString = function(candidate) {
  if (typeof candidate !== 'string') {
    throw new Error('"' + candidate + '" must be a string');
  }
  return candidate;
};

Testcase._sanitizePositiveInteger = function(candidate) {
  // FIXME Avoid the duplication
  try {
    candidate = candidate.trim();
  } finally {
    if (!/^[0-9]+$/.test(candidate)) {
      throw new Error('"' + candidate + '" must be a positive finite integer');
    }

    return Number(candidate);
  }
};

Testcase._isOptionalFieldDefined = function(candidate) {
  return typeof candidate !== 'undefined';
};

module.exports = Testcase;
