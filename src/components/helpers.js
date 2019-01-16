import { isEmail, isMobilePhone, isURL } from 'validator';
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
export const getSubMenu = ({location, intl}) => {
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

/**
 * Checking if string has a valid UUID format
 * @param str
 * @returns {*}
 */
export const isUUID = str => {
  return str.match(/[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/gm);
};