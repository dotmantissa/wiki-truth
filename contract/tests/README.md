# WikiTruth Contract Tests

Direct tests for `contract/wiki_truth.py`.

## Run

```bash
pytest contract/tests/direct -v
```

These tests mock Wikipedia API responses via `direct_vm.mock_web`, so they run fast and do not depend on live network responses.
