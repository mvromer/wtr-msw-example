import { expect, fixture, html } from '@open-wc/testing';

import { waitForNetworkIdle } from 'wtr-playwright-commands';

import type { MyTaskElement } from '../src/my-task-element.js';

import '../src/my-task-element.js';

describe('MyTaskElement', () => {
  it('can async load in willUpdate [WORKAROUND: uses waitForNetworkIdle server command]', async () => {
    const el = await fixture<MyTaskElement>(
      html`<my-task-element user-id="2"></my-task-element>`
    );
    await waitForNetworkIdle();
    const nameValueEl = el.shadowRoot?.querySelector('dd:nth-of-type(2)');
    expect(nameValueEl).to.exist;
    expect(nameValueEl).to.have.trimmed.text('Ervin Howell');
  });
});
