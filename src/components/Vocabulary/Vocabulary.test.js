import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

// Mocks
import { mockedContext, vocabularyAdmin, user} from '../../__mocks__/context.mock';
import messages from '../../../public/_translations/en';
// Components
import App from '../App';
import Vocabulary from './';
import Exception403 from '../exception/403';

// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('../AppContext', () => ({
  Consumer: ({ children }) => children(mockContext()),
}));
const key = 'BASIS_OF_RECORD';
const appProps = {
  locale: {
    locale: 'en',
    messages: messages,
    antLocale: {},
    loading: false
  }
};

describe('<Vocabulary/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockedContext);
  });

  it('should render 403 for users withoit VOCABULARY_ADMIN role', () => {
    
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/vocabulary/${key}`]}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Vocabulary)).toHaveLength(0);
    expect(wrapper.find(Exception403)).toHaveLength(1);
  });

  it('should render presentation page for vocabulary admins', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: vocabularyAdmin
    });
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/vocabulary/${key}`]}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Vocabulary)).toHaveLength(1);
  });

  it('should render 403 instead of Create page for an unauthorised user', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/vocabulary/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Vocabulary)).toHaveLength(0);
    expect(wrapper.find(Exception403)).toHaveLength(1);
  });

  it('should not render Create page for an authorised user without ADMIN role', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: user
    });

    const wrapper = mount(
      <MemoryRouter initialEntries={['/vocabulary/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Vocabulary)).toHaveLength(0);
    expect(wrapper.find(Exception403)).toHaveLength(1);
  }); 

  it('should render Create page for a user with ADMIN role', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: vocabularyAdmin
    });

    const wrapper = mount(
      <MemoryRouter initialEntries={['/vocabulary/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Vocabulary)).toHaveLength(1);
  });


});