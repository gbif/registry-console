export const mockedContext = {
  changeLocale: jest.fn(),
  notifications: [],
  languages: [],
  countries: [],
  licenses: [],
  installationTypes: [],
  addError: jest.fn()
};

export const user = {
  userName: 'test',
  roles: ['USER']
};

export const userEditor = {
  userName: 'editor',
  roles: ['USER', 'REGISTRY_EDITOR'],
  editorRoleScopes: ['0c1f1074-48e8-46d3-abad-9ee264ab8c8e']
};

export const userEditorWithNode = {
  userName: 'editor',
  roles: ['USER', 'REGISTRY_EDITOR'],
  _editorRoleScopeItems: [{ type: 'node', key: '0c1f1074-48e8-46d3-abad-9ee264ab8c8e' }]
};

export const userEditorWithOrganization = {
  userName: 'editor',
  roles: ['USER', 'REGISTRY_EDITOR'],
  _editorRoleScopeItems: [{ type: 'organization' }]
};

export const userAdmin = {
  userName: 'admin',
  roles: ['USER', 'REGISTRY_EDITOR', 'REGISTRY_ADMIN']
};