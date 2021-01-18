import _getDeep from 'lodash/get';
import _uniq from 'lodash/uniq';
// APIs
// Currently we do only have node and organizations in scope - at some point i assume me must ask for dataset, collections etc. Or better yet, update the API to return the type.
import { getNode } from '../../api/node';
import { getOrganization } from '../../api/organization';
import { getNetwork } from '../../api/network';
import { rights } from './enums';

const entityTypes = {
  NODE: 'NODE',
  ORGANIZATION: 'ORGANIZATION',
  NETWORK: 'NETWORK'
};

/**
 * Decorate user with rights and more info about the type of the UUIDs in scope (dataset or organization etc)
 * @param {*} user
 */
export const decorateUser = async user => {
  const _editorRoleScopeItems = await getScopes(user);
  const _scopeTypes = _uniq(_editorRoleScopeItems.map(item => item.type));
  const _rights = getRights(user, _scopeTypes);
  return {
    ...user,
    _editorRoleScopeItems,
    _scopeTypes,
    _rights
  };
};

/**
 * Requesting user items by keys from editorRoleScopes list
 * @param editorRoleScopes - list of keys (UUIDs) which indicates users scope
 */
const getScopes = async ({ editorRoleScopes = [] }) => {
  const items = [];
  for (const key of editorRoleScopes) {
    let item = await getItem(key, getNode, entityTypes.NODE);
    if (!item) item = await getItem(key, getOrganization, entityTypes.ORGANIZATION);
    if (!item) item = await getItem(key, getNetwork, entityTypes.NETWORK);
    if (item) items.push(item);
  }
  return items;
};

async function getItem(key, apiFn, type) {
  try {
    const data = (await apiFn(key)).data;
    return { data, type };
  } catch (err) {
    if (_getDeep(err, 'response.status') !== 404) {
      throw err; // If a request fails we can not assign the proper access rights to the user. Throw an error and let the consumer decide what to do.
    }
    // Just returned undefined if there is no data.
  }
}

function getRights(user, _scopeTypes) {
  let userRights = [];
  if (_scopeTypes.includes(entityTypes.NODE)) {
    userRights.push(rights.CAN_ADD_ORGANIZATION);
    userRights.push(rights.CAN_ADD_DATASET);
  }
  if (_scopeTypes.includes(entityTypes.ORGANIZATION)) {
    userRights.push(rights.CAN_ADD_DATASET);
  }
  return _uniq(userRights);
}
