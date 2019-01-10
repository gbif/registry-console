import React from 'react';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import createRouterContext from 'react-router-test-context';
import PropTypes from 'prop-types';

// Components
import AuthRoute from './AuthRoute';
import Organization from './Organization';
import User from './User';
import Exception403 from './exception/403';
// Mocks
import {
  mockedContext,
  userAdmin,
  userEditorWithOrganization,
  userEditorWithNode
} from '../__mocks__/context.mock';

// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('./AppContext', () => ({
  Consumer: ({ children }) => children(mockContext())
}));

describe('<AuthRoute/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockedContext);
  });

  it('should not render component for unauthorized user', () => {
    const context = createRouterContext({ location: { pathname: '/organization/create' } });
    const childContextTypes = {
      router: PropTypes.object
    };
    const wrapper = mount(
      <IntlProvider>
        <AuthRoute
          exact
          path="/organization/create"
          key="createOrganization"
          component={Organization}
          type={'organization'}
          roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}
        />
      </IntlProvider>
      , { context, childContextTypes });

    expect(wrapper.find(Organization).exists()).toBe(false);
    expect(wrapper.find(Exception403).exists()).toBe(true);
  });

  it('should not render component for user without required scope', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userEditorWithOrganization
    });
    const context = createRouterContext({ location: { pathname: '/organization/create' } });
    const childContextTypes = {
      router: PropTypes.object
    };
    const wrapper = mount(
      <IntlProvider>
        <AuthRoute
          exact
          path="/organization/create"
          key="createOrganization"
          component={Organization}
          type={'organization'}
          roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}
        />
      </IntlProvider>
      , { context, childContextTypes });

    expect(wrapper.find(Organization).exists()).toBe(false);
    expect(wrapper.find(Exception403).exists()).toBe(true);
  });

  it('should render component for user with required scope', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userEditorWithNode
    });
    const context = createRouterContext({ location: { pathname: '/organization/create' } });
    const childContextTypes = {
      router: PropTypes.object
    };
    const wrapper = mount(
      <IntlProvider>
        <AuthRoute
          exact
          path="/organization/create"
          key="createOrganization"
          component={Organization}
          type={'organization'}
          roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}
        />
      </IntlProvider>
      , { context, childContextTypes });

    expect(wrapper.find(Organization).exists()).toBe(true);
    expect(wrapper.find(Exception403).exists()).toBe(false);
  });

  it('should not render component for user without ADMIN role', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userEditorWithNode
    });
    const context = createRouterContext({ location: { pathname: '/user/search' } });
    const childContextTypes = {
      router: PropTypes.object
    };
    const wrapper = mount(
      <IntlProvider>
        <AuthRoute
          exact
          path="/user/search"
          component={User}
          roles={['REGISTRY_ADMIN']}
        />
      </IntlProvider>
      , { context, childContextTypes });

    expect(wrapper.find(User).exists()).toBe(false);
    expect(wrapper.find(Exception403).exists()).toBe(true);
  });

  it('should render component for user with ADMIN role', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userAdmin
    });
    const context = createRouterContext({ location: { pathname: '/user/search' } });
    const childContextTypes = {
      router: PropTypes.object
    };
    const wrapper = mount(
      <IntlProvider>
        <AuthRoute
          exact
          path="/user/search"
          component={User}
          roles={['REGISTRY_ADMIN']}
        />
      </IntlProvider>
      , { context, childContextTypes });

    expect(wrapper.find(User).exists()).toBe(true);
    expect(wrapper.find(Exception403).exists()).toBe(false);
  });
});