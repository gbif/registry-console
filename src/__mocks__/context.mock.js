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
  roles: ['USER', 'REGISTRY_EDITOR', 'REGISTRY_ADMIN'],
  _rights: ['CAN_ADD_DATASET', 'CAN_ADD_NETWORK']
};

export const userGrSciCollAdmin = {
  userName: 'admin',
  roles: ['GRSCICOLL_ADMIN'],
  _rights: ['CAN_ADD_COLLECTION', 'CAN_ADD_INSTITUTION', 'CAN_ADD_GRSCICOLL_PERSON']
};

export const vocabularyAdmin = {
  userName: 'vocabularyAdmin',
  roles: ['USER', 'VOCABULARY_ADMIN']
}