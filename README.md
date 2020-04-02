# action-has-permission

Action for checking user's permission to access repository.

It takes a required permission and checks if the user can acess the repository with at least the requested level of permissions. Its output can e.g. be used in conditions to contol the execution of subsequent steps of a job.

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
uses: actions/action-has-permission
with:
  required-permission: write
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### More complete example

```yaml
name: Action Sample

# Run job when a new pull request is opened
on: [pull_request]

jobs:
  check_user_permission:
    runs-on: ubuntu-latest
    name: A job to check user's permission level
    steps:
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
