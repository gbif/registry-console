import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

// Mocks
import { mockedContext } from '../../__mocks__/context.mock';
import messages from '../../../public/_translations/en';
// Components
import App from '../App';
import Node from './';

// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('../AppContext', () => ({
  Consumer: ({ children }) => children(mockContext()),
}));
const key = '0c1f1074-48e8-46d3-abad-9ee264ab8c8e';
const appProps = {
  locale: {
    locale: 'en',
    messages: messages,
    antLocale: {},
    loading: false
  }
};

describe('<Node/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockedContext);
  });

  it('should render Node presentation page', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/node/${key}`]}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Node)).toHaveLength(1);
  });
});