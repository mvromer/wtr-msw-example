> **NOTE:** This is no longer relevant. The solution was a fix applied in 0.3.0 of the wds-use-vite
> plugin this example uses for integrating Vite middleware into the WTR server request pipeline.

# Inconsistent Test Results

The following show three back-to-back-to-back runs of WTR that perform tests for the `my-element`
component. The test in my-element.incorrect.test.ts incorrectly only awaits the `fixture` call that
does the initial rendering of the component under test. Since the asynchronous data fetch hasn't
completed, the test assertion fails when it looks for that data to be rendered.

The test in my-element.workaround.test.ts shows one approach to working around this. It uses a
custom command plugin to WTR that will cause the test to wait until Playwright receives a network
idle load status. The idea is to have the test wait until network activity has stopped before with
proceeding. It's not necessarily the most robust solution, but it does provide a reliable enough
solution to this particular situation, where it is already assumed that WTR is configured to use the
Playwright browser launcher.

## Result outputs

The outputs of the three runs are shown below, including timestamps. They were executed on a
Windows 10 machine within a PowerShell 7 session. I have put each run in its own code fence to
make it easier to distinguish each run's output from one another.

### Run 1

In this run, the output of the failing test is shown for both tests. It also reports that no test
file succeeded even though the test in the *.workaround.test.ts file is known to succeed. It also
reports a coverage of ~79%.

```
[12:11:32.063 (13 Sep 2023)] [3.499s] [ﲍ ERROR]
└─[~\code\wtr-msw-example] [main ≡  +2] → npx wtr '.\test\my-element.*.test.ts'

test\my-element.workaround.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-element] starting willUpdate
      [my-element] fetching user 2
      [my-element] rendering

 ❌ MyElement > can async load in willUpdate [INCORRECT: will fail because render completes before fetch completes]
      AssertionError: expected dd to have trimmed text 'Ervin Howell', but the trimmed text was ''
      + expected - actual

      +Ervin Howell

      at n.<anonymous> (test\my-element.incorrect.test.ts:14:40)

test\my-element.incorrect.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-element] starting willUpdate
      [my-element] fetching user 2
      [my-element] rendering

 ❌ MyElement > can async load in willUpdate [INCORRECT: will fail because render completes before fetch completes]
      AssertionError: expected dd to have trimmed text 'Ervin Howell', but the trimmed text was ''
      + expected - actual

      +Ervin Howell

      at n.<anonymous> (test\my-element.incorrect.test.ts:14:40)

Chromium: |██████████████████████████████| 2/2 test files | 0 passed, 2 failed

Code coverage: 79.41 %
View full coverage report at .coverage\lcov-report\index.html

Finished running tests in 1.2s with 2 failed tests.
```

### Run 2

In this run, the output of the succeeding test is shown for both tests. It also reports that all
test files succeed even though the test in the *.incorrect.test.ts file is known to fail. It also
reports a coverage of ~94%.

```
[12:11:40.372 (13 Sep 2023)] [3.489s] [ﲍ ERROR]
└─[~\code\wtr-msw-example] [main ≡  +2] → npx wtr '.\test\my-element.*.test.ts'

test\my-element.incorrect.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-element] starting willUpdate
      [my-element] fetching user 2
      [my-element] rendering
      [my-element] fetched user 2
      [my-element] ending willUpdate
      [my-element] starting willUpdate
      [my-element] ending willUpdate
      [my-element] rendering

test\my-element.workaround.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-element] starting willUpdate
      [my-element] fetching user 2
      [my-element] rendering
      [my-element] fetched user 2
      [my-element] ending willUpdate
      [my-element] starting willUpdate
      [my-element] ending willUpdate
      [my-element] rendering

Chromium: |██████████████████████████████| 2/2 test files | 2 passed, 0 failed

Code coverage: 94.4 %
View full coverage report at .coverage\lcov-report\index.html

Finished running tests in 1.8s, all tests passed! 🎉
```

### Run 3

In this run, the output is what I would expect. The output of the failing test is listed under the
results of the failing test, and the output of the succeeding test is listed under the results of
the succeeding test. It correctly reports that 1 test file succeeded and that 1 failed. It also
shows the coverage overall is 94%.

```
[12:11:47.517 (13 Sep 2023)] [4.202s]
└─[~\code\wtr-msw-example] [main ≡  +2] → npx wtr '.\test\my-element.*.test.ts'

test\my-element.incorrect.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-element] starting willUpdate
      [my-element] fetching user 2
      [my-element] rendering

 ❌ MyElement > can async load in willUpdate [INCORRECT: will fail because render completes before fetch completes]
      AssertionError: expected dd to have trimmed text 'Ervin Howell', but the trimmed text was ''
      + expected - actual

      +Ervin Howell

      at n.<anonymous> (test\my-element.incorrect.test.ts:14:40)

test\my-element.workaround.test.ts:

 🚧 Browser logs:
      Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
      [my-element] starting willUpdate
      [my-element] fetching user 2
      [my-element] rendering
      [my-element] fetched user 2
      [my-element] ending willUpdate
      [my-element] starting willUpdate
      [my-element] ending willUpdate
      [my-element] rendering

Chromium: |██████████████████████████████| 2/2 test files | 1 passed, 1 failed

Code coverage: 94.4 %
View full coverage report at .coverage\lcov-report\index.html

Finished running tests in 1.8s with 1 failed tests.
```

## Observations

I have no idea if any of this is relevant. However, it is some observations I do see.

* In the first two runs where the test output is incorrect, it's always the output of the last
  reported test that shows up.
* It appears the coverage report is derived from the last reported test. In the case where the
  failing test was reported last, the lower coverage number was also reported.
