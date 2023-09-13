import { expect, fixture, html } from '@open-wc/testing';

import { waitForNetworkIdle } from './commands/wait-for-network-idle.js';

import type { MyElement } from '../src/my-element.js';

import '../src/my-element.js';

describe('MyElement', () => {
  it('can async load in willUpdate [WORKAROUND: uses waitForNetworkIdle server command]', async () => {
    const el = await fixture<MyElement>(
      html`<my-element user-id="2"></my-element>`
    );
    await waitForNetworkIdle();
    const nameValueEl = el.shadowRoot?.querySelector('dd:nth-of-type(2)');
    expect(nameValueEl).to.exist;
    expect(nameValueEl).to.have.trimmed.text('Ervin Howell');
  });
});
