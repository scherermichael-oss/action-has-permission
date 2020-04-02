'use strict';

const core = require('@actions/core');
const github = require('@actions/github');

const permissions = ['none', 'read', 'write', 'admin'];

const checkPermission = async function() {
  try {
    const requiredPermission = core.getInput('required-permission');
    core.debug(`Required permission: ${requiredPermission}`);

    if (permissions.indexOf(requiredPermission) < 0) {
      core.setFailed(`Required permission must be one of: ${permissions.toString()}`);
      return;
    }

    const payload = await github.repos.checkCollaborator({ ...github.context.repo, username: github.context.actor });

    if (!payload || !payload.data || !payload.data.permission) {
      core.debug(`No user permission found in payload: ${payload}`);
      return false;
    }

    const userPermission = payload.data.permission;

    core.debug(`User permission: ${userPermission}`);

    // Return true, if required level is equal or less than actual permission
    core.debug(`Result: ${permissions.indexOf(requiredPermission) <= permissions.indexOf(userPermission)}`);

    return permissions.indexOf(requiredPermission) <= permissions.indexOf(userPermission);
  } catch (ex) {
    core.debug(`Exception: ${ex.message}`);
    return false;
  }
};

module.exports = checkPermission;
