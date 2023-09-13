import { expect, fixture, html } from '@open-wc/testing';

import type { MyElement } from '../src/my-element.js';

import '../src/my-element.js';

describe('MyElement', () => {
  it('can async load in willUpdate [INCORRECT: will fail because render completes before fetch completes]', async () => {
    const el = await fixture<MyElement>(
      html`<my-element user-id="2"></my-element>`
    );
    const nameValueEl = el.shadowRoot?.querySelector('dd:nth-of-type(2)');
    expect(nameValueEl).to.exist;
    expect(nameValueEl).to.have.trimmed.text('Ervin Howell');
  });
});
