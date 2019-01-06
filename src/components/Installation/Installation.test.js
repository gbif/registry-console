import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

// Mocks
import { mockedContext, userAdmin } from '../../__mocks__/context.mock';
import messages from '../../../public/_translations/en';
// Components
import App from '../App';
import Installation from './';
import Exception403 from '../exception/403';

// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('../AppContext', () => ({
  Consumer: ({ children }) => children(mockContext()),
}));
const key = '5abfd780-912e-40da-b81e-af36b2170b3f';
const appProps = {
  locale: {
    locale: 'en',
    messages: messages,
    antLocale: {},
    loading: false
  }
};

describe('<Installation/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockedContext);
  });

  it('should render 403 instead of Create page for a user without required roles', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/installation/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Installation)).toHaveLength(0);
    expect(wrapper.find(Exception403)).toHaveLength(1);
  });

  it('should render Create page for a user with required roles', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userAdmin
    });

    const wrapper = mount(
      <MemoryRouter initialEntries={['/installation/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Installation)).toHaveLength(1);
  });

  it('should render Installation presentation page', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/installation/${key}`]}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Installation)).toHaveLength(1);
  });
});