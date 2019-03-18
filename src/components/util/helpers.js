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
 * Function removes protocols and www
 * @param url
 * @returns {*}
 */
export const simplifyHttpUrls = url => {
  return url.replace(/^http(s)?:\/\/(www\.)?/, '');
};

/**
 * Namespace for default values
 * This is the only one option that differ machine tag from default values
 * @type {string}
 */
export const defaultNameSpace = 'default-term.gbif.org';

export const isValidLatitude = value => {
  const latitude = parseFloat(value);
  return Number.isFinite(latitude) && latitude <= 90 && latitude >= -90;
};

export const isValidLongitude = value => {
  const longitude = parseFloat(value);
  return Number.isFinite(longitude) && longitude <= 180 && longitude >= -180;
};

/**
 * Returns cookie value
 * @param name - cookie name
 * @returns {string} - value or undefined
 */
export const getCookie = name => {
  let matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + '=([^;]*)'
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * Set cookie
 * Note: cookie set without expiration date will be remove if user closes the browser
 *
 * @param {string} name - name with which it will be possible to get cookie later
 * @param {string} value - cookie value
 * @param {object} options - additional settings { path, expires, domain, secure }
 */
export const setCookie = (name, value, options = {}) => {
  let expires = options.expires;
  if (!options.path) {
    options.path = '/';
  }

  if (typeof expires == 'number' && expires) {
    let d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  let updatedCookie = name + '=' + value;

  for (let propName of Object.keys(options)) {
    updatedCookie += '; ' + propName;
    let propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }

  document.cookie = updatedCookie;
};

/**
 * Delete cookie
 * @param {string} name - cookie name
 */
export const deleteCookie = name => {
  setCookie(name, '', {
    expires: -1
  });
};

/**
 * Generates random hash string
 * @returns {string}
 */
export const generateKey = () => {
  let hash = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i++)
    hash += possible.charAt(Math.floor(Math.random() * possible.length));

  return hash;
};