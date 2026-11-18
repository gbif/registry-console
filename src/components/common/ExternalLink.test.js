/* eslint-disable no-script-url */ // these tests check that script URLs are not linked
import React from 'react';
import { shallow } from 'enzyme';

import ExternalLink from './ExternalLink';

describe('<ExternalLink/>', () => {
  it('renders an http(s) URL as a link that opens in a new tab', () => {
    const wrapper = shallow(<ExternalLink url="https://www.gbif.org/" />);
    const a = wrapper.find('a');
    expect(a.prop('href')).toBe('https://www.gbif.org/');
    expect(a.prop('target')).toBe('_blank');
    expect(a.prop('rel')).toBe('noopener noreferrer');
    expect(a.text()).toBe('https://www.gbif.org/');
  });

  it('renders a javascript: URL as plain text', () => {
    const wrapper = shallow(<ExternalLink url="javascript:void(0)" />);
    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.text()).toBe('javascript:void(0)');
  });

  it('keeps custom link text', () => {
    const wrapper = shallow(<ExternalLink url="https://example.org/a.zip">DwCA</ExternalLink>);
    expect(wrapper.find('a').text()).toBe('DwCA');
  });

  it('shows custom text without a link when the URL is not safe', () => {
    const wrapper = shallow(<ExternalLink url="javascript:void(0)">DwCA</ExternalLink>);
    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.text()).toBe('DwCA');
  });

  it('renders no link when the URL is missing', () => {
    const wrapper = shallow(<ExternalLink />);
    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.text()).toBe('');
  });
});
