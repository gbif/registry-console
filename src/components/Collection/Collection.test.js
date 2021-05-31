import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

// Mocks
import { mockedContext, userGrSciCollAdmin } from '../../__mocks__/context.mock';
import messages from '../../../public/_translations/en';
// Components
import App from '../App';
import Collection from './';
import Exception403 from '../exception/403';

// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('../AppContext', () => ({
  Consumer: ({ children }) => children(mockContext()),
}));
const key = '821a6b5b-143f-479f-8be5-227ecd58aa48';
const appProps = {
  locale: {
    locale: 'en',
    messages: messages,
    antLocale: {},
    loading: false
  }
};

describe('<Collection/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockedContext);
  });

  // No longer the case now that we allow suggestions
  // it('should render 403 instead of Collection Create page for a user without required roles', () => {
  //   const wrapper = mount(
  //     <MemoryRouter initialEntries={['/collection/create']}>
  //       <App {...appProps}/>
  //     </MemoryRouter>
  //   );

  //   expect(wrapper.find(Collection)).toHaveLength(0);
  //   expect(wrapper.find(Exception403)).toHaveLength(1);
  // });

  // Since all auth logic is now controlled by the API, we need to rewrite all auth based tests
  // it('should render Collection Create page for a user with required roles', () => {
  //   mockContext.mockReturnValue({
  //     ...mockedContext,
  //     user: userGrSciCollAdmin
  //   });

  //   const wrapper = mount(
  //     <MemoryRouter initialEntries={['/collection/create']}>
  //       <App {...appProps}/>
  //     </MemoryRouter>
  //   );

  //   expect(wrapper.find(Collection)).toHaveLength(1);
  // });

  it('should render Collection presentation page', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/collection/${key}`]}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Collection)).toHaveLength(1);
  });
});