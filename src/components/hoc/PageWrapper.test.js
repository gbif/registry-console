import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { Spin } from 'antd';

import PageWrapper from './PageWrapper';
import Exception404 from '../exception/404';
import Exception500 from '../exception/500';
import Exception523 from '../exception/523';
import { IntlProvider } from 'react-intl';

const content = <div>Some content</div>;

describe('<PageWrapper/>', () => {
  it('should render Spin when loading=true', () => {
    const wrapper = mount(
      <PageWrapper status={200} loading={true}>
        {content}
      </PageWrapper>
    );

    expect(wrapper.find(Spin));
  });

  it('should render content when !loading and status !== 404|500|523', () => {
    const wrapper = mount(
      <PageWrapper status={200} loading={false}>
        {content}
      </PageWrapper>
    );

    expect(wrapper.find(content));
  });

  it('should render Exception404 if status 404', () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <MemoryRouter>
          <PageWrapper status={404} loading={false}>
            {content}
          </PageWrapper>
        </MemoryRouter>
      </IntlProvider>
    );

    expect(wrapper.find(Exception404));
  });

  it('should render Exception500 if status 500', () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <MemoryRouter>
          <PageWrapper status={500} loading={false}>
            {content}
          </PageWrapper>
        </MemoryRouter>
      </IntlProvider>
    );

    expect(wrapper.find(Exception500));
  });

  it('should render Exception523 if status 523', () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <MemoryRouter>
          <PageWrapper status={523} loading={false}>
            {content}
          </PageWrapper>
        </MemoryRouter>
      </IntlProvider>
    );

    expect(wrapper.find(Exception523));
  });
});