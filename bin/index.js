'use strict';

const core = require('@actions/core');

const checkPermission = require('../lib/checkPermission');

(async () => {
  core.setOutput('hasPermission', await checkPermission());
})();
