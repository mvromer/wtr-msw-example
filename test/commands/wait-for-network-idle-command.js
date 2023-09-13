export function waitForNetworkIdleCommand() {
  return {
    name: 'wait-for-network-idle-command',

    async executeCommand({ command, payload, session }) {
      if (command === 'wait-for-network-idle') {
        if (session.browser.type === 'playwright') {
          const page = session.browser.getPage(session.id);
          await page.waitForLoadState('networkidle');
          return true;
        }

        throw new Error(
          `Cannot wait for idle load state in browser ${session.browser.type}`
        );
      }
    },
  };
}
