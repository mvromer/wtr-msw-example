import { addVite, useVite } from 'wds-use-vite';
import { defaultReporter } from '@web/test-runner';
import { junitReporter } from '@web/test-runner-junit-reporter';
import { playwrightLauncher } from '@web/test-runner-playwright';

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  files: ['test/**/*.test.ts'],
  nodeResolve: true,
  plugins: [addVite()],
  middleware: [useVite()],
  browsers: [playwrightLauncher({ product: 'chromium' })],
  reporters: [
    defaultReporter({ reportTestResults: true, reportTestProgress: false }),
    junitReporter({
      outputPath: './junit-test-results.xml',
      reportLogs: true,
    }),
  ],
  coverage: true,
  coverageConfig: {
    reportDir: '.coverage',
    reporters: ['lcov', 'text'],
    // NOTE: work around issue in how WTR applies coverage filters
    // See: https://github.com/modernweb-dev/web/issues/1400#issuecomment-1543733840
    include: ['**'],
    exclude: ['**/node_modules/**', '**/*.svg'],
  },
};

export default config;
