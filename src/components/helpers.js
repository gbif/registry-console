import { isEmail, isMobilePhone, isURL } from 'validator';

// APIs
import { getNode } from '../api/node';
import { getOrganization } from '../api/organization';

/**
 * Due to changes, some fields could be represented strings, but we need arrays
 * @param value
 * @returns {*}
 */
export const stringToArray = value => {
  if (Array.isArray(value)) {
    return value;
  } else if (value) {
    return [value];
  }

  return [];
};

/**
 * Prettify License links into a more readable form
 * @param name - license link
 * @returns {*}
 */
export const prettifyLicense = name => {
  switch (name) {
    case 'http://creativecommons.org/publicdomain/zero/1.0/legalcode':
      return 'CC0 1.0';
    case 'http://creativecommons.org/licenses/by/4.0/legalcode':
      return 'CC-BY 4.0';
    case 'http://creativecommons.org/licenses/by-nc/4.0/legalcode':
      return 'CC-BY-NC 4.0';
    default:
      return name;
  }
};

/**
 * Getting a translated title for an active subtype
 * @param location - location object taken from props
 * @param intl - translation object taken from injectIntl
 * @returns {null}
 */
export const getSubMenu = ({location, intl}) => {
  const keys = location.pathname.slice(1).split('/');

  if (keys[0] === 'grbio') {
    return keys[3] ? intl.formatMessage({ id: `submenu.${keys[3]}` }) : null;
  }

  return keys[2] ? intl.formatMessage({ id: `submenu.${keys[2]}` }) : null;
};

/**
 * Requesting all items for current user
 * @param editorRoleScopes - list of UIDs from User's scope
 * @returns {Array} - list of items, organizations or nodes
 */
export const getUserItems = async editorRoleScopes => {
  const list = [];

  for (const key of editorRoleScopes) {
    // First, we think that it is a node
    try {
      const node = (await getNode(key)).data;
      node.type = 'node'; // We'll use this option later in our checks
      list.push(node);
    } catch (e) {
      // Else it is and org
      const org = (await getOrganization(key)).data;
      org.type = 'organization'; // We'll use this option later in our checks
      list.push(org);
    }
  }

  return list;
};

/**
 * Helper to check if a user has permissions to create an item
 * @param editorRoleScopeItems - user role's scope of UIDs
 * @param type - type of item (Organizations, Dataset, Installation, Node)
 * @returns {boolean}
 */
export const canCreateItem = (editorRoleScopeItems, type) => {
  switch (type) {
    case 'organization':
      return editorRoleScopeItems.some(item => item.type === 'node');
    case 'dataset':
      return editorRoleScopeItems.some(item => ['organization', 'node'].includes(item.type));
    case 'installation':
      return editorRoleScopeItems.some(item => ['organization', 'node'].includes(item.type));
    default:
      return true;
  }
};

/**
 * Filter of organization based on user role's scope
 * @param user - user object with role's scope
 * @param organizations - list or organizations
 * @returns {*}
 */
export const getPermittedOrganizations = (user, organizations) => {
  const { editorRoleScopes: UIDs } = user;

  if (user.roles.includes('REGISTRY_ADMIN')) {
    return organizations;
  }

  return organizations.filter(organization => {
    return UIDs.includes(organization.key) || UIDs.includes(organization.endorsingNodeKey);
  });
};


/* Custom Form validation */

/**
 * Custom email validation
 * https://github.com/yiminghe/async-validator/
 * @param errorMessage - message to return in the case of error
 * @returns {Function} - custom validator
 */
export const validateEmail = errorMessage => (rule, value, callback) => {
  if (Array.isArray(value)) {
    const isValid = value.every(item => item && isEmail(item));
    if (!isValid) {
      callback(errorMessage);
    }
  } else if (value && !isEmail(value)) {
    callback(errorMessage);
  }
  callback();
};

/**
 * Custom phone validation
 * https://github.com/yiminghe/async-validator/
 * @param errorMessage - message to return in the case of error
 * @returns {Function} - custom validator
 */
export const validatePhone = errorMessage => (rule, value, callback) => {
  if (Array.isArray(value)) {
    const isValid = value.every(item => item && isMobilePhone(item));
    if (!isValid) {
      callback(errorMessage);
    }
  } else if (value && !isMobilePhone(value)) {
    callback(errorMessage);
  }
  callback();
};

/**
 * Custom URL validation
 * https://github.com/yiminghe/async-validator/
 * @param errorMessage - message to return in the case of error
 * @returns {Function} - custom validator
 */
export const validateUrl = errorMessage => (rule, value, callback) => {
  if (Array.isArray(value)) {
    const isValid = value.every(item => item && isURL(item));
    if (!isValid) {
      callback(errorMessage);
    }
  } else if (value && !isURL(value)) {
    callback(errorMessage);
  }
  callback();
};

/**
 * Custom DOI validator
 * https://www.crossref.org/blog/dois-and-matching-regular-expressions/
 * should match all new and 99% of existing (based on 75 million reference database)
 * @param errorMessage - message to return in the case of error
 * @returns {Function} - custom validator
 */
export const validateDOI = errorMessage => (rule, value, callback) => {
  const regex = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;

  if (value && !regex.test(value)) {
    callback(errorMessage);
  }
  callback();
};