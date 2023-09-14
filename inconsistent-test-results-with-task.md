> **NOTE:** This is no longer relevant. The solution was a fix applied in 0.3.0 of the wds-use-vite
> plugin this example uses for integrating Vite middleware into the WTR server request pipeline.

# Inconsistent Test Results

The following show three back-to-back-to-back runs of WTR that perform tests for the
`my-task-element` component. The outputs here are analogous to the outputs for the `my-element`
tests described in [inconsistent-test-results.md](./inconsistent-test-results.md).

Similar to the `my-element` tests, there are two tests for `my-task-element`. The first one in
my-task-element.incorrect.test.ts does not properly wait for the component to loads its data before
asserting that the data is properly rendered. The second test in my-task-element.workaround.test.ts
uses the same custom WTR command to tell Playwright to wait for a network load status before
asserting the component's rendered output.

Note that coverage output was disabled in these runs.

## Result outputs

### Run 1

In this run, the output of the failing test is shown for both tests. It also reports that no test
file succeeded even though the test in the *.workaround.test.ts file is known to succeed.

```
[13:06:44.309 (13 Sep 2023)] [4.21s]
└─[~\code\wtr-msw-example] [main ≡  ~1] → npx wtr '.\test\my-task-element.*.test.ts'

test\my-task-element.incorrect.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-task-element] starting willUpdate
      [my-task-element] ending willUpdate
      [my-task-element] fetching user 2
      [my-task-element] rendering

 ❌ MyTaskElement > can async load in willUpdate [INCORRECT: will fail because render completes before fetch completes]
      AssertionError: expected null to exist
        at n.<anonymous> (test\my-task-element.incorrect.test.ts:13:27)

test\my-task-element.workaround.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-task-element] starting willUpdate
      [my-task-element] ending willUpdate
      [my-task-element] fetching user 2
      [my-task-element] rendering

 ❌ MyTaskElement > can async load in willUpdate [INCORRECT: will fail because render completes before fetch completes]
      AssertionError: expected null to exist
        at n.<anonymous> (test\my-task-element.incorrect.test.ts:13:27)

Chromium: |██████████████████████████████| 2/2 test files | 0 passed, 2 failed

Finished running tests in 1.1s with 2 failed tests.
```

### Run 2

In this run, the output of the succeeding test is shown for both tests. It also reports that all
test files succeed even though the test in the *.incorrect.test.ts file is known to fail.

```
[13:06:52.946 (13 Sep 2023)] [3.466s] [ﲍ ERROR]
└─[~\code\wtr-msw-example] [main ≡  ~1] → npx wtr '.\test\my-task-element.*.test.ts'

test\my-task-element.incorrect.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-task-element] starting willUpdate
      [my-task-element] ending willUpdate
      [my-task-element] fetching user 2
      [my-task-element] rendering
      [my-task-element] fetched user 2
      [my-task-element] starting willUpdate
      [my-task-element] ending willUpdate
      [my-task-element] rendering

test\my-task-element.workaround.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-task-element] starting willUpdate
      [my-task-element] ending willUpdate
      [my-task-element] fetching user 2
      [my-task-element] rendering
      [my-task-element] fetched user 2
      [my-task-element] starting willUpdate
      [my-task-element] ending willUpdate
      [my-task-element] rendering

Chromium: |██████████████████████████████| 2/2 test files | 2 passed, 0 failed

Finished running tests in 1.7s, all tests passed! 🎉
```

### Run 3

In this run, the output is what I would expect. The output of the failing test is listed under the
results of the failing test, and the output of the succeeding test is listed under the results of
the succeeding test. It correctly reports that 1 test file succeeded and that 1 failed.

```
[13:07:00.797 (13 Sep 2023)] [4.042s]
└─[~\code\wtr-msw-example] [main ≡  ~1] → npx wtr '.\test\my-task-element.*.test.ts'

test\my-task-element.incorrect.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-task-element] starting willUpdate
      [my-task-element] ending willUpdate
      [my-task-element] fetching user 2
      [my-task-element] rendering

 ❌ MyTaskElement > can async load in willUpdate [INCORRECT: will fail because render completes before fetch completes]
      AssertionError: expected null to exist
        at n.<anonymous> (test\my-task-element.incorrect.test.ts:13:27)

test\my-task-element.workaround.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-task-element] starting willUpdate
      [my-task-element] ending willUpdate
      [my-task-element] fetching user 2
      [my-task-element] rendering
      [my-task-element] fetched user 2
      [my-task-element] starting willUpdate
      [my-task-element] ending willUpdate
      [my-task-element] rendering

Chromium: |██████████████████████████████| 2/2 test files | 1 passed, 1 failed

Finished running tests in 1.6s with 1 failed tests.
```
