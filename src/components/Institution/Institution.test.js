import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

// Mocks
import { mockedContext, userAdmin } from '../../__mocks__/context.mock';
import messages from '../../../public/_translations/en';
// Components
import App from '../App';
import Institution from './';
import Exception403 from '../exception/403';

// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('../AppContext', () => ({
  Consumer: ({ children }) => children(mockContext()),
}));
const key = '1203c0e3-4d8a-42d9-8023-88afcbd02449';
const appProps = {
  locale: {
    locale: 'en',
    messages: messages,
    antLocale: {},
    loading: false
  }
};

describe('<Institution/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockedContext);
  });

  it('should render 403 instead of Institution Create page for a user without required roles', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/institution/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Institution)).toHaveLength(0);
    expect(wrapper.find(Exception403)).toHaveLength(1);
  });

  it('should render Institution Create page for a user with required roles', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userAdmin
    });

    const wrapper = mount(
      <MemoryRouter initialEntries={['/institution/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Institution)).toHaveLength(1);
  });

  it('should render Institution presentation page', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/institution/${key}`]}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Institution)).toHaveLength(1);
  });
});