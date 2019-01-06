import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

// Mocks
import { mockedContext, userAdmin, userEditor } from '../../__mocks__/context.mock';
import messages from '../../../public/_translations/en';
// Components
import App from '../App';
import User from './';
import Exception403 from '../exception/403';

// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('../AppContext', () => ({
  Consumer: ({ children }) => children(mockContext()),
}));
const appProps = {
  locale: {
    locale: 'en',
    messages: messages,
    antLocale: {},
    loading: false
  }
};

describe('<User/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockedContext);
  });

  it('should render 403 page for unauthorized user', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/user/test']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(User)).toHaveLength(0);
    expect(wrapper.find(Exception403)).toHaveLength(1);
  });

  it('should render 403 page for authorized user without ADMIN role', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userEditor
    });

    const wrapper = mount(
      <MemoryRouter initialEntries={['/user/test']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(User)).toHaveLength(0);
    expect(wrapper.find(Exception403)).toHaveLength(1);
  });

  it('should render User page for a user with ADMIN role', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userAdmin
    });

    const wrapper = mount(
      <MemoryRouter initialEntries={['/user/test']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(User)).toHaveLength(1);
  });
});