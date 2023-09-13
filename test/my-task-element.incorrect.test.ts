import { expect, fixture, html } from '@open-wc/testing';

import type { MyTaskElement } from '../src/my-task-element.js';

import '../src/my-task-element.js';

describe('MyTaskElement', () => {
  it('can async load in willUpdate [INCORRECT: will fail because render completes before fetch completes]', async () => {
    const el = await fixture<MyTaskElement>(
      html`<my-task-element user-id="2"></my-task-element>`
    );
    const nameValueEl = el.shadowRoot?.querySelector('dd:nth-of-type(2)');
    expect(nameValueEl).to.exist;
    expect(nameValueEl).to.have.trimmed.text('Ervin Howell');
  });
});
