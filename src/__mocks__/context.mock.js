export const mockedContext = {
  changeLocale: jest.fn(),
  notifications: [],
  languages: [],
  countries: [],
  licenses: [],
  installationTypes: [],
  addError: jest.fn()
};

export const userEditor = {
  userName: 'editor',
  roles: ['USER', 'REGISTRY_EDITOR']
};

export const userAdmin = {
  userName: 'admin',
  roles: ['USER', 'REGISTRY_EDITOR', 'REGISTRY_ADMIN']
};