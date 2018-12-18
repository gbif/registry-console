// List of the fields which should contain arrays
// if we do not create arrays from the string values, the request will fail
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

  return keys[2] ? intl.formatMessage({ id: `submenu.${keys[2]}` }) : null;
};