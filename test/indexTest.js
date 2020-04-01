'use strict';

const assert = require('assertthat');

const index = require('../lib');

suite('index', () => {
  test('is a function.', async () => {
    return assert.that(index).is.ofType('function');
  });
});
