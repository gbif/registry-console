import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import ShowMoreContent from './ShowMoreContent';

const render = content => mount(
  <IntlProvider locale="en">
    <ShowMoreContent content={content} />
  </IntlProvider>
);

// The div that holds the description, as opposed to the outer container and the toggle
const contentDiv = wrapper => wrapper.getDOMNode().firstChild;

describe('<ShowMoreContent/>', () => {
  it('renders formatted HTML without event handlers', () => {
    const div = contentDiv(render('<p>Hello <b>there</b></p><img src="x" onerror="x()">'));
    expect(div.innerHTML).toContain('<p>Hello <b>there</b></p>');
    expect(div.querySelector('img').hasAttribute('onerror')).toBe(false);
  });

  it('shows plain text with < and > as written', () => {
    const text = 'Depth < 10 m and > 5 m\nSecond line & more';
    expect(contentDiv(render(text)).textContent).toBe(text);
  });

  it('renders empty when there is no description', () => {
    expect(contentDiv(render('')).innerHTML).toBe('');
  });
});
