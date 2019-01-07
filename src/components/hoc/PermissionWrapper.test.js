import React from 'react';
import { mount } from 'enzyme';

// Components
import PermissionWrapper from './PermissionWrapper';
// Mocks
import {
  mockedContext,
  userEditor,
  userAdmin,
  user,
  userEditorWithOrganization,
  userEditorWithNode
} from '../../__mocks__/context.mock';


// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('../AppContext', () => ({
  Consumer: ({ children }) => children(mockContext())
}));
const content = <div>Some content</div>;

describe('<PermissionWrapper/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockedContext);
  });

  it('does not display content for unauthorized user', () => {
    const wrapper = mount(
      <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']} uuids={[]}>
        {content}
      </PermissionWrapper>
    );

    expect(wrapper.contains(content)).toBe(false);
  });

  it('does not display content for user without required role', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user
    });

    const wrapper = mount(
      <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']} uuids={[]}>
        {content}
      </PermissionWrapper>
    );

    expect(wrapper.contains(content)).toBe(false);
  });

  it('displays content for user with required scope', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userEditor
    });

    const wrapper = mount(
      <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']} uuids={userEditor.editorRoleScopes}>
        {content}
      </PermissionWrapper>
    );

    expect(wrapper.contains(content)).toBe(true);
  });

  it('does not display content for user without required scope', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userEditor
    });

    const wrapper = mount(
      <PermissionWrapper roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']} uuids={['0c1f1074-48e8-46d3-abad-9ee264ab8c33']}>
        {content}
      </PermissionWrapper>
    );

    expect(wrapper.contains(content)).toBe(false);
  });

  it('does not display content for user without required scope items', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userEditorWithOrganization
    });

    const wrapper = mount(
      <PermissionWrapper roles={['REGISTRY_EDITOR']} uuids={[]} createType="organization">
        {content}
      </PermissionWrapper>
    );

    expect(wrapper.contains(content)).toBe(false);
  });

  it('displays content for user with required scope items', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userEditorWithNode
    });

    const wrapper = mount(
      <PermissionWrapper roles={['REGISTRY_EDITOR']} uuids={[]} createType="organization">
        {content}
      </PermissionWrapper>
    );

    expect(wrapper.contains(content)).toBe(true);
  });

  it('does not display content for user if content ADMIN ONLY', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userEditor
    });

    const wrapper = mount(
      <PermissionWrapper roles={['REGISTRY_ADMIN']} uuids={[]}>
        {content}
      </PermissionWrapper>
    );

    expect(wrapper.contains(content)).toBe(false);
  });

  it('displays content for user with role ADMIN', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userAdmin
    });

    const wrapper = mount(
      <PermissionWrapper roles={['REGISTRY_EDITOR']} uuids={[]}>
        {content}
      </PermissionWrapper>
    );

    expect(wrapper.contains(content)).toBe(true);
  });
});