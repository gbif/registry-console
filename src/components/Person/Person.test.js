import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

// Mocks
import { mockedContext, userAdmin } from '../../__mocks__/context.mock';
import messages from '../../../public/_translations/en';
// Components
import App from '../App';
import Person from './';
import Exception403 from '../exception/403';

// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('../AppContext', () => ({
  Consumer: ({ children }) => children(mockContext()),
}));
const key = '0d2fd0f3-8609-45a7-8af2-e14f63b5bc8e';
const appProps = {
  locale: {
    locale: 'en',
    messages: messages,
    antLocale: {},
    loading: false
  }
};

describe('<Person/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockedContext);
  });

  it('should render 403 instead of Person Create page for a user without required roles', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/person/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Person)).toHaveLength(0);
    expect(wrapper.find(Exception403)).toHaveLength(1);
  });

  it('should render Person Create page for a user with required roles', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userAdmin
    });

    const wrapper = mount(
      <MemoryRouter initialEntries={['/person/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Person)).toHaveLength(1);
  });

  it('should render Person presentation page', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/person/${key}`]}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Person)).toHaveLength(1);
  });
});