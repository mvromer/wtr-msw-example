import { addVite, useVite } from 'wds-use-vite';
import { defaultReporter } from '@web/test-runner';
import { junitReporter } from '@web/test-runner-junit-reporter';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { waitForNetworkIdlePlugin } from 'wtr-playwright-commands/plugin.js';

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  files: ['test/**/*.test.ts'],
  nodeResolve: true,
  plugins: [
    addVite(),

    // Component tests that depend on rendering data that is asynchronously fetched over the network
    // will typically fail unless there is some way to tell the test to wait until the component has
    // fetched the data and rendered it. The default fixture from open-wc/testing will simply wait
    // until the first render pass is done on the component, which typically isn't enough time for
    // the asynchronous data load to complete.
    //
    // There are a lot of different strategies for dealing with this, all with varying degrees of
    // hackiness and brittleness. This example command below is somewhere in the middle. It assumes
    // you are using Playwright as your page launcher for your tests. It allows a test to wait for
    // Playwright to receive a network idle event before proceeding.
    waitForNetworkIdlePlugin(),
  ],
  middleware: [useVite()],
  browsers: [playwrightLauncher({ product: 'chromium' })],
  reporters: [
    defaultReporter({ reportTestProgress: true, reportTestResults: true }),
    junitReporter({
      outputPath: './junit-test-results.xml',
      reportLogs: true,
    }),
  ],
  coverage: true,
  coverageConfig: {
    reportDir: '.coverage',
    reporters: ['lcov'],
    // NOTE: work around issue in how WTR applies coverage filters
    // See: https://github.com/modernweb-dev/web/issues/1400#issuecomment-1543733840
    include: ['**'],
    exclude: ['**/node_modules/**', '**/*.svg'],
  },
};

export default config;
