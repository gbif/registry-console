import { hasRole, hasRight, hasScope, roles, hasPermission } from './index';

// has role
describe('can authenticate per role', () => {
  it('rejects unAuthenticated users', () => {
    expect(hasRole(undefined, ['SOME ROLE'])).toBe(false);
  });

  it('rejects authenticated users without the required role', () => {
    const user = {roles: ['USER_ONLY']};
    expect(hasRole(user, ['ADMIN'])).toBe(false);
  });

  it('rejects authenticated users with unexpected data format', () => {
    const user = {};
    expect(hasRole(user, ['ADMIN'])).toBe(false);
  });

  it('rejects all including ADMIN is no roles is given', () => {
    const user = {roles: [roles.REGISTRY_ADMIN]};
    expect(hasRole(user, [])).toBe(false);
  });

  it('welcomes authenticated users without the required role', () => {
    const user = {roles: ['USER_ONLY', 'ADMIN']};
    expect(hasRole(user, ['DATA_MANAGER','ADMIN'])).toBe(true);
  });

  it('rejects authenticated users without any roles', () => {
    const user = {};
    expect(hasRole(user, ['ADMIN'])).toBe(false);
  });
});

// has rights
describe('can authenticate per right', () => {
  it('rejects unAuthenticated users', () => {
    expect(hasRight(undefined, ['SOME RIGHT'])).toBe(false);
  });

  it('rejects authenticated users without the required right', () => {
    const user = {_rights: ['RIGHT_A']};
    expect(hasRight(user, ['RIGHT_B'])).toBe(false);
  });

  it('welcomes role ADMIN, despite not having explicit right', () => {
    const user = {roles: [roles.REGISTRY_ADMIN]};
    expect(hasRight(user, ['RIGHT_A'])).toBe(true);
  });

  it('rejects role EDITOR with wrong rights', () => {
    const user = {roles: [roles.REGISTRY_EDITOR], _rights: ['RIGHT_A']};
    expect(hasRight(user, ['RIGHT_B'])).toBe(false);
  });

  it('can handle missing roles', () => {
    const user = {_rights: ['RIGHT_A']};
    expect(hasRight(user, ['RIGHT_B'])).toBe(false);
  });

  it('welcomes NOT ADMINS with the correct right', () => {
    const user = {roles: ['NOT_ADMIN'], _rights: ['RIGHT_A']};
    expect(hasRight(user, ['RIGHT_A'])).toBe(true);
  });
});

// has scope
describe('can authenticate per scope', () => {
  it('rejects unAuthenticated users', () => {
    expect(hasScope(undefined, ['SOME SCOPE'])).toBe(false);
  });

  it('rejects authenticated users without the required scope', () => {
    const user = {editorRoleScopes: ['SCOPE_A']};
    expect(hasScope(user, ['SCOPE_B'])).toBe(false);
  });

  it('welcomes role ADMIN, despite not having explicit scope', () => {
    const user = {roles: [roles.REGISTRY_ADMIN]};
    expect(hasScope(user, ['SCOPE_A'])).toBe(true);
  });

  it('rejects role EDITOR with wrong scope', () => {
    const user = {roles: [roles.REGISTRY_EDITOR], editorRoleScopes: ['SCOPE_A']};
    expect(hasScope(user, ['SCOPE_B'])).toBe(false);
  });

  it('rejects role EDITOR with empty scope', () => {
    const user = {roles: [roles.REGISTRY_EDITOR], editorRoleScopes: []};
    expect(hasScope(user, ['SCOPE_A'])).toBe(false);
  });

  it('welcomes NON ADMINS with the correct role', () => {
    const user = {roles: ['NOT_ADMIN'], editorRoleScopes: ['SCOPE_A']};
    expect(hasScope(user, ['SCOPE_A'])).toBe(true);
  });
});

// Has permissions
describe('can authenticate users using object signature', () => {
  it('rejects if no params is given', () => {
    const user = {editorRoleScopes: ['RIGHT_A']};
    expect(hasPermission(user, {})).toBe(false);
  });

  it('rejects if wrong params is given', () => {
    const user = {editorRoleScopes: ['RIGHT_A']};
    expect(hasPermission(user, {roles: ['RIGHT_A']})).toBe(false);
  });

  it('rejects if multiple params is given', () => {
    const user = {roles: ['ADMIN']};
    expect(hasPermission(user, {roles: ['ADMIN'], rights: ['SOME_RIGHT']})).toBe(false);
  });

  it('welcomes user if one param that match is provided', () => {
    const user = {roles: ['ADMIN']};
    expect(hasPermission(user, {roles: ['ADMIN']})).toBe(true);
  });
});