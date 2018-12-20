// List of the fields which should contain arrays
// if we do not create arrays from the string values, the request will fail
import { getNode } from '../api/node';
import { getOrganization } from '../api/organization';

const arrayFields = [
  'address',
  'email',
  'homepage',
  'phone',
  'position',
  'userId'
];

/**
 * Preparing form data before sending it
 * * creating arrays for the fields with a multiple inputs via ;
 * @param values - form data object
 * @returns - updated object
 */
export const prepareData = values => {
  for (const key in values) {
    if (!values.hasOwnProperty(key)) {
      continue;
    }

    if (values[key] && arrayFields.includes(key) && values[key].includes(';')) {
      values[key] = values[key].split(';').map(item => item.trim());
    }
  }

  return values;
};

export const stringToArray = value => {
  if (Array.isArray(value)) {
    return value;
  } else if (value) {
    return [value];
  }

  return [];
};

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

export const getPermittedOrganizations = (user, organizations) => {
  const { editorRoleScopes: UIDs } = user;

  if (user.roles.includes('REGISTRY_ADMIN')) {
    return organizations;
  }

  return organizations.filter(organization => {
    return UIDs.includes(organization.key) || UIDs.includes(organization.endorsingNodeKey);
  });
};