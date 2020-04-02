# action-has-permission

Test 2

GitHub Action for checking user's permission to access repository.

It takes a required permission and checks if the user can acess the repository with at least the requested level of permissions. Its output can be used e.g. in [conditions](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idif) to contol the execution of subsequent steps of a job.

## Inputs

### `required-permission`

The minimal required permission.

Possible values: `"read"`, `"write"`, `"admin"`

Default: `"write"`

## Outputs

### `has-permission`

Possible values:

- `"1"` if user has required permission, which evaluates to `true` in a GitHub Actions condition.
- `""` otherwise, which evaluates to `false`.

## Example usage

```yaml
uses: scherermichael/action-has-permission@master
with:
  required-permission: write
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### More complete example

```yaml
name: Action Sample Workflow

# Run workflow when a new pull request is opened
on: [pull_request]

jobs:
  check_user_permission:
    runs-on: ubuntu-latest
    name: A job to check user's permission level
    steps:
      # Check for write permission
      - name: Check user permission
        id: check
        uses: scherermichael/action-has-permission@master
        with:
          required-permission: write
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      # Use the output from the `check` step
      - name: Run only if user has sufficient permissions
        if: steps.check.outputs.has-permission
        run: echo "Congratulations! Your permissions to access the repository are sufficient."
      - name: Run only if user has NOT sufficient permissions
        if: "! steps.check.outputs.has-permission"
        run: echo "Sorry! Your permissions are insufficient."
```

## Implementation notes

The production-related Node.js modules must be added to this repository to allow the action to run. Modules that are only used for development should **not** be included in order to reduce the number of files.

Run the following commands to update modules correctly:

```sh
echo "Removing all Node.js modules..."
rm -rf package-lock.json node_modules
echo "Installing production-related modules..."
npm install --production
echo "Committing changes..."
git add -f package-lock.json node_modules
git commit -m "chore: Update Node.js modules"
echo "Installing all other modules again..."
npm install
```
