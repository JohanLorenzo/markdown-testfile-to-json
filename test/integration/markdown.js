'use strict';

var assert = require('chai').assert;
var parseMarkdown = require('../../lib/parsers/markdown');

describe('The markdown parser', function() {

  it('should transform the whole markdown file into this whole json file', function() {
    var actualResult = parseMarkdown(['# Launch suite',
      '',
      '## fxos.func.sanity.launch_contacts',
      '`bug 2 `',
      '`story 1`',
      '`draft`',
      '',
      'Launch contacts! this is an updated version',
      '',
      '## fxos.func.sanity.launch_music',
      '`bug 3 `',
      '`story 3`',
      '`disabled`',
      '',
      'Launch music',
      '',
      '',
      '## fxos.func.sanity.launch_sms_repeated',
      '`bug 3 `',
      '`story 3`',
      '`xfail`',
      '',
      'Launch SMS and measure elapsed time',
      'Do it again.',
      'And again.',
      '',
      '',
      '## fxos.func.parameterized.test',
      'Launch the dialog, insert :val1, :val2, :val3 and hit enter.',
      '',
      'ID  | val1 | val2 | val3 |',
      '--- | ---- | ---- | -----',
      'id1 | a    | 1    | one one',
      'id2 | b    | 2    | two two',
      '',
      '',
      '## fxos.func.sanity.launch_rocketbar',
      '`bug 4`',
      '`story 3`',
      '`draft`',
      '',
      'Launch rocketbar'
    ].join('\n'));

    assert.deepEqual(actualResult, [{
      name: 'Launch suite',
      testcases: [{
        "id": "fxos.func.sanity.launch_contacts",
        "bug": 2,
        "userStory": 1,
        "state": "draft",
        "instructions": "Launch contacts! this is an updated version"
      }, {
        "id": "fxos.func.sanity.launch_music",
        "bug": 3,
        "userStory": 3,
        "state": "disabled",
        "instructions": "Launch music"
      }, {
        "id": "fxos.func.sanity.launch_sms_repeated",
        "bug": 3,
        "userStory": 3,
        "state": "xfail",
        "instructions": "Launch SMS and measure elapsed time\nDo it again.\nAnd again."
      }, {
        "id": "fxos.func.parameterized.test",
        "instructions": "Launch the dialog, insert :val1, :val2, :val3 and hit enter.",
        "state": "active",
        "variables": [{
          "ID": "id1",
          "val1": "a",
          "val2": "1",
          "val3": "one one"
        }, {
          "ID": "id2",
          "val1": "b",
          "val2": "2",
          "val3": "two two"
        }]
      }, {
        "id": "fxos.func.sanity.launch_rocketbar",
        "bug": 4,
        "userStory": 3,
        "state": "draft",
        "instructions": "Launch rocketbar"
      }]
    }]);
  });

});
