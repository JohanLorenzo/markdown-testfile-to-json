#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> A parser which transform manual tests in Mardown to JSON

## As a command line tool
```sh
$ ./cli.js test-formated-file.md [test-formated-file2.md...]
```

```sh
$ npm install --global markdown-testfile-to-json
$ markdown-testfile-to-json --help
```

## As a library

### Install

```sh
$ npm install --save markdown-testfile-to-json
```

### Usage

```js
var markdownTestfileToJson = require('markdown-testfile-to-json');

markdownTestfileToJson([inputFile1, inputFile2]).then(function(testsuites) {
  // Do something with the testsuites
});
```

# Syntax
## General structure
``` markdown
# Suite Name

## product.app.test_case_id
`decorator`

Test instructions
```

## Suite name
To be deprecated.

## IDs
Valid IDs are lower case. Words are separated by either dots (.) or underscores (_).
The recommended format is `product.app.test_case_id`

``` markdown
Valid
## fxos.sms.send_mms

Not valid
## fxos.sms.send_MMS
## fxos.sms.send-mms
```

## Decorators
They are used to describe the test case right above it (no blank line in the middle).
One decorator is recommended (but not mandatory): ``` `bug n` ```, with n the bug number that introduced the feature on [Bugzilla](https://bugzilla.mozilla.org/).
You can also define the user story that introduced the feature on [Aha](http://aha.io): ``` `story n` ```.
You can choose to not activate a test with one of these decorator: ``` `draft` `disabled` `xfail` ```. If none of these decorator is provided, the test will be considered active.

``` markdown
Valid
## fxos.sms.send_mms
`bug 1`

Not valid
## fxos.sms.send_mms

`bug 1`

## fxos.sms.send_mms
`disabled`
```

## Suite matrices
You can specify a set of variable common to many test cases. By defining a [markdown table](https://help.github.com/articles/github-flavored-markdown/#tables). Put the
table at the top of the file. For example:

``` markdown
# SMS suite

 | TMobile | Wi-FI | No Internet | 2G | 3G | Multiple SIMS | Reference Workload | AT&T | Automatic Download | Delivery Reports | Airplane Mode | Dual SIM priority | Multiple Recipient Thread |
:--                                      |:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:
fxos.sms.send_sms                        | x | x | x | x | x | x | x | x | x | x | x | x | x
fxos.sms.send_mms                        | x | x | x | x | x | x | x | x | x | x | x | x | x
fxos.sms.forward_sms                     |   |   | x |   |   |   |   | x |   |   |   |   |
fxos.sms.call_recipient                  |   |   | x |   |   |   |   | x |   |   |   |   |

## fxos.sms.send_sms
`bug 1`

Send a text message to another phone number.

## fxos.sms.send_mms
`bug 2`

Receive a text message from another phone number.

## fxos.sms.forward_sms
`bug 3`

Send an SMS you received to another contact.

## fxos.sms.call_recipient
`bug 4`

From a text conversation, perform a call to your contact.

```
Please note that the ID must be defined below

## Test case matrices
A single test case can have multiple variables.

``` markdown
## fxos.sms.text_new_number
`bug 5`

Create a new text message and add the following recipients:

recipients   | should pass
----         | ----
123          | yes
+++          | no
contact name | yes
```

# Output
Like mentioned in the name of the project, this parser returns a JSON ouput.
## Suite matrix example
``` json
[{
  "name": "SMS suite",
  "testcases": [{
    "id": "fxos.sms.send_sms",
    "instructions": "Send a text message to another phone number.",
    "state": "active",
    "bug": 1,
    "variablesFromSuite": ["TMobile", "Wi-FI", "No Internet", "2G", "3G", "Multiple SIMS", "Reference Workload", "AT&T", "Automatic Download", "Delivery Reports", "Airplane Mode", "Dual SIM priority", "Multiple Recipient Thread"]
  }, {
    "id": "fxos.sms.send_mms",
    "instructions": "Receive a text message from another phone number.",
    "state": "active",
    "bug": 2,
    "variablesFromSuite": ["TMobile", "Wi-FI", "No Internet", "2G", "3G", "Multiple SIMS", "Reference Workload", "AT&T", "Automatic Download", "Delivery Reports", "Airplane Mode", "Dual SIM priority", "Multiple Recipient Thread"]
  }, {
    "id": "fxos.sms.forward_sms",
    "instructions": "Send an SMS you received to another contact.",
    "state": "active",
    "bug": 3,
    "variablesFromSuite": ["No Internet", "AT&T"]
  }, {
    "id": "fxos.sms.call_recipient",
    "instructions": "From a text conversation, perform a call to your contact.",
    "state": "active",
    "bug": 4,
    "variablesFromSuite": ["No Internet", "AT&T"]
  }]
}]
```

## Test case matrix example
``` json
[{
  "name": "SMS suite",
  "testcases": [{
    "id": "fxos.sms.text_new_number",
    "instructions": "Create a new text message and add the following recipients:",
    "state": "active",
    "bug": 5,
    "variables": [{
      "recipients": "123",
      "should pass": "yes"
    }, {
      "recipients": "+++",
      "should pass": "no"
    }, {
      "recipients": "contact name",
      "should pass": "yes"
    }]
  }]
}]
```
# License

MIT


[npm-image]: https://badge.fury.io/js/markdown-testfile-to-json.svg
[npm-url]: https://npmjs.org/package/markdown-testfile-to-json
[travis-image]: https://travis-ci.org/JohanLorenzo/markdown-testfile-to-json.svg?branch=master
[travis-url]: https://travis-ci.org/JohanLorenzo/markdown-testfile-to-json
[daviddm-image]: https://david-dm.org/JohanLorenzo/markdown-testfile-to-json.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/JohanLorenzo/markdown-testfile-to-json
[coveralls-image]: https://coveralls.io/repos/JohanLorenzo/markdown-testfile-to-json/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/JohanLorenzo/markdown-testfile-to-json?branch=master
