import isArray from 'lodash/isArray';
import { roles } from './enums';

/**
 * @param {object} user 
 * @param {string|array[string]} roles 
 */
export const hasRole = (user, roles) => {
  if (!user || !roles || !isArray(user.roles)) return false;
  const rolesArray = [].concat(roles);
  return rolesArray.some(role => user.roles.includes(role));
};

/**
 * @param {object} user 
 * @param {string|array[string]} rights 
 */
export const hasRight = (user, rights) => {
  if (!user || !rights) return false;
  if (hasRole(user, roles.REGISTRY_ADMIN)) return true;
  if (!isArray(user._rights)) return false;
  const rightsArray = [].concat(rights);
  return rightsArray.some(right => user._rights.includes(right));
};

/**
 * @param {object} user 
 * @param {string|array[string]} uuids 
 */
export const hasScope = (user, uuids) => {
  if (!user || !uuids) return false;
  if (hasRole(user, roles.REGISTRY_ADMIN)) return true;
  if (!isArray(user.editorRoleScopes)) return false;
  const uuidsArray = [].concat(uuids);
  return uuidsArray.some(uuid => user.editorRoleScopes.includes(uuid.toString()));
};

/**
 * @param {object} user 
 * @param {object} values 
 */
export const hasPermission = (user, {roles, rights, uuids}) => {
  let access = false;
  if ([roles, rights, uuids].filter(val => typeof(val) !== 'undefined').length === 1 ) {
    if (roles) access = hasRole(user, roles);
    if (rights) access = hasRight(user, rights);
    if (uuids) access = hasScope(user, uuids);
  }
  return access;
};
