import _startCase from 'lodash/startCase';

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

export const prettifyEnum = _startCase;

/**
 * Getting a translated title for an active subtype
 * @param location - location object taken from props
 * @param intl - translation object taken from injectIntl
 * @returns {null}
 */
export const getSubMenu = ({ location, intl }) => {
  const keys = location.pathname.slice(1).split('/');

  return keys[2] ? intl.formatMessage({ id: `submenu.${keys[2]}`, defaultMessage: keys[2] }) : null;
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

/**
 * Checking if string has a valid UUID format
 * @param str
 * @returns {*}
 */
export const isUUID = str => {
  return str.match(/[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/gm);
};

/**
 * Parsing date to work properly with Date.parse Safari implementation
 * @param dtStr
 * @returns {Date}
 */
export const dateForSafari = dtStr => {
  let parsedStr = dtStr.split(/[^0-9]/);
  return new Date(parsedStr[0], parsedStr[1] - 1, parsedStr[2], parsedStr[3], parsedStr[4], parsedStr[5]);
};