// Roles that are relevant to the registry
export const roles = {
  REGISTRY_ADMIN: 'REGISTRY_ADMIN',
  REGISTRY_EDITOR: 'REGISTRY_EDITOR'
};

// Rights - these allow for special complex rights to be added to the user at login and used elsewhere. E.g. can edit this speciel organization, bun only on tuesdays.
export const rights = {
  CAN_ADD_ORGANIZATION: 'CAN_ADD_ORGANIZATION',
  CAN_ADD_DATASET: 'CAN_ADD_DATASET',
  CAN_ADD_COLLECTION: 'CAN_ADD_COLLECTION',
  CAN_ADD_INSTITUTION: 'CAN_ADD_INSTITUTION',
  CAN_ADD_INSTALLATION: 'CAN_ADD_INSTALLATION',
  CAN_ADD_GRSCICOLL_PERSON: 'CAN_ADD_GRSCICOLL_PERSON',
  CAN_ADD_NETWORK: 'CAN_ADD_NETWORK'
};