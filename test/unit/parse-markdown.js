'use strict';
var assert = require('assert');
var parseMarkdown = require('../../lib/parse-markdown');

describe('The magical ugly parser', function () {

  it('should transform the whole markdown file into this whole json file', function() {
    var actualResult = parseMarkdown(['# Functional',
    '',
    '## Launch suite',
    '',
    '### fxos.func.sanity.launch-contacts',
    '`Bug 2 `',
    '`Story 1`',
    '`Draft`',
    '',
    'Launch contacts! this is an updated version',
    '',
    '### fxos.func.sanity.launch-music',
    '`Bug 3 `',
    '`Story 3`',
    '`Disabled`',
    '',
    'Launch music',
    '',
    '',
    '### fxos.func.sanity.launch-sms-repeated',
    '`Bug 3 `',
    '`Story 3`',
    '`Xfail`',
    '',
    'Launch SMS and measure elapsed time',
    'Do it again.',
    'And again.',
    '',
    '',
    '### fxos.func.parameterized.test',
    'Launch the dialog, insert :val1, :val2, :val3 and hit enter.',
    '',
    'ID  | val1 | val2 | val3 |',
    '--- | ---- | ---- | -----',
    'id1 | a    | 1    | one one',
    'id2 | b    | 2    | two two',
    '',
    '',
    '### fxos.func.sanity.launch-rocketbar',
    '`Bug 4`',
    '`Story 3`',
    '`Draft`',
    '',
    'Launch rocketbar'].join('\n'));

    assert.deepEqual(actualResult, [{"id":"fxos.func.sanity.launch-contacts","bug":"2","userStory":"1","state":"draft","instructions":"Launch contacts! this is an updated version"},{"id":"fxos.func.sanity.launch-music","bug":"3","userStory":"3","state":"disabled","instructions":"Launch music"},{"id":"fxos.func.sanity.launch-sms-repeated","bug":"3","userStory":"3","state":"xfail","instructions":"Launch SMS and measure elapsed time\nDo it again.\nAnd again."},{"id":"fxos.func.parameterized.test","instructions":"Launch the dialog, insert :val1, :val2, :val3 and hit enter.","variables":[{"ID":"id1","val1":"a","val2":"1","val3":"one one"},{"ID":"id2","val1":"b","val2":"2","val3":"two two"}]},{"id":"fxos.func.sanity.launch-rocketbar","bug":"4","userStory":"3","state":"draft","instructions":"Launch rocketbar"}]);
  });

});
