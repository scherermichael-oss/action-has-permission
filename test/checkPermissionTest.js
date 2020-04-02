'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const core = require('@actions/core');

const checkPermission = require('../lib/checkPermission');

let repos;
let checkPermissionsMock;

suite('checkPermission', () => {
  setup(async () => {
    repos = { checkCollaborator: sinon.fake() };
    checkPermissionsMock = proxyquire('../lib/checkPermission', {
      '@actions/github': {
        context: {
          actor: 'actor',
          repo: {
            owner: 'owner',
            repo: 'repo'
          }
        },
        repos
      }
    });
  });

  teardown(async () => {
    sinon.restore();
  });

  test('is a function.', async () => {
    return assert.that(checkPermission).is.ofType('function');
  });

  test('fails if invalid required permission is given.', async () => {
    const setFailedFake = sinon.fake();

    sinon.replace(core, 'setFailed', setFailedFake);
    sinon.replace(core, 'getInput', sinon.fake.returns('invalid'));

    const actual = await checkPermission();

    assert.that(actual).is.falsy();
    assert.that(await setFailedFake.lastArg).is.equalTo('Required permission must be one of: none,read,write,admin');
  });

  test('checks collaborator via GitHub API.', async () => {
    sinon.replace(core, 'getInput', sinon.fake.returns('admin'));

    await checkPermissionsMock();

    assert.that(repos.checkCollaborator.lastArg).is.equalTo({
      owner: 'owner',
      repo: 'repo',
      username: 'actor'
    });
  });

  suite('returns false if', () => {
    test('an exception is thrown.', async () => {
      sinon.replace(core, 'getInput', sinon.fake.returns('admin'));
      repos.checkCollaborator = sinon.fake.throws(new Error('foo'));

      const actual = await checkPermissionsMock();

      assert.that(actual).is.false();
    });

    test('no permission is returned by GitHub.', async () => {
      sinon.replace(core, 'getInput', sinon.fake.returns('admin'));

      const actual = await checkPermissionsMock();

      assert.that(actual).is.false();
    });

    test('permission of user is below "read".', async () => {
      const requiredPermission = 'read';
      sinon.replace(core, 'getInput', sinon.fake.returns(requiredPermission));

      const userPermission = 'none';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      const actual = await checkPermissionsMock();
      assert.that(actual).is.false();
    });

    test('permission of user is below "write".', async () => {
      let userPermission;
      const requiredPermission = 'write';
      sinon.replace(core, 'getInput', sinon.fake.returns(requiredPermission));

      userPermission = 'none';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      assert.that(await checkPermissionsMock()).is.false();

      userPermission = 'read';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      assert.that(await checkPermissionsMock()).is.false();
    });

    test('permission of user is below "admin".', async () => {
      let userPermission;
      const requiredPermission = 'admin';
      sinon.replace(core, 'getInput', sinon.fake.returns(requiredPermission));

      userPermission = 'none';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      assert.that(await checkPermissionsMock()).is.false();

      userPermission = 'read';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      assert.that(await checkPermissionsMock()).is.false();

      userPermission = 'write';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      assert.that(await checkPermissionsMock()).is.false();
    });
  });

  suite('returns true if', () => {
    test('permission of user is at least "read".', async () => {
      let userPermission;
      const requiredPermission = 'read';
      sinon.replace(core, 'getInput', sinon.fake.returns(requiredPermission));

      userPermission = 'read';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      assert.that(await checkPermissionsMock()).is.true();

      userPermission = 'write';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      assert.that(await checkPermissionsMock()).is.true();

      userPermission = 'admin';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      assert.that(await checkPermissionsMock()).is.true();
    });

    test('permission of user is at least "write".', async () => {
      let userPermission;
      const requiredPermission = 'write';
      sinon.replace(core, 'getInput', sinon.fake.returns(requiredPermission));

      userPermission = 'write';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      assert.that(await checkPermissionsMock()).is.true();

      userPermission = 'admin';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      assert.that(await checkPermissionsMock()).is.true();
    });

    test('permission of user is "admin".', async () => {
      const requiredPermission = 'admin';
      sinon.replace(core, 'getInput', sinon.fake.returns(requiredPermission));

      const userPermission = 'admin';
      repos.checkCollaborator = sinon.fake.returns({ data: { permission: userPermission } });
      assert.that(await checkPermissionsMock()).is.true();
    });
  });
});
