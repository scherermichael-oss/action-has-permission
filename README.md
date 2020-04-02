# action-has-permission

Action for checking user's permission to access repository

## Inputs

### `required-permission`

**Required** The minimal user's permission required to access the repository.

- Possible values: `"read"`, `"write"`, `"admin"` 
- Default: `"write"`

## Outputs

### `has-permission`

`true` if user has required permission. `false` otherwise.

## Example usage

```
uses: actions/action-has-permission@v1
with:
  required-permission: "write"
```

### More complete example

```
check_user_permission:
  runs-on: ubuntu-latest
  name: A job to check user's permission level
  steps:
  - name: Check user permission
    id: check
    uses: actions/action-has-permission@v1
    with:
      required-permission: "write"
  # Use the output from the `check` step
  - name: Run only if user has sufficent permissions
    if: ${{ steps.check.outputs.has-permission }}
    run: echo "Congratulations! Your permissions to access the repository are sufficent."
  - name: Run only if user has NOT sufficent permissions
    if: "! ${{ steps.check.outputs.has-permission }}"
    run: echo "Sorry! Your permissions are insufficent."
```