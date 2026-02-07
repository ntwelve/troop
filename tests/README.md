# Troop Unit Tests

This directory contains unit tests for the Troop avatar generator JavaScript code.

## Test Framework

- **Jest** - Modern JavaScript testing framework
- **jsdom** - Simulated browser environment for Node.js

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Coverage

The test suite covers:

### Utility Functions
- **ucfirst()** - 7 test cases covering capitalization edge cases
  - Lowercase strings
  - Uppercase strings
  - Single characters
  - Empty strings
  - Strings with spaces
  - Strings starting with numbers
  - Special characters
  - Unicode characters

- **clean()** - 8 test cases covering string cleaning
  - Removing dots
  - Removing hyphens
  - Combined removal
  - Empty strings
  - First occurrence behavior
  - Complex layer item IDs

### Constants
- **bodyCanvasWidth** - Canvas dimensions
- **layerMargin** - Layer spacing
- **layerAllowMany** - Layer configuration for multiple items

## Test Structure

```
tests/
└── troop.test.js        # Main test suite
```

## Adding New Tests

To add new tests:

1. Open `tests/troop.test.js`
2. Add a new `test()` or `describe()` block
3. Write your test assertions using Jest's `expect()` API
4. Run `npm test` to verify

Example:
```javascript
test('should do something', () => {
  expect(troop.ucfirst('test')).toBe('Test');
});
```

## Test Results

Current test results: **27 tests passing**

```
Test Suites: 1 passed, 1 total
Tests:       27 passed, 27 total
```

## Notes

- The main application code (`js/troop.js`) has been modified to export functions for testing while maintaining browser compatibility
- Tests run in Node.js environment with jsdom
- jQuery is mocked as `null` in tests since utility functions don't depend on it
- DOM-dependent functions are not currently tested (would require extensive mocking)
