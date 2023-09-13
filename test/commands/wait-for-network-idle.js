import { executeServerCommand } from '@web/test-runner-commands';

export function waitForNetworkIdle() {
  return executeServerCommand('wait-for-network-idle');
}
