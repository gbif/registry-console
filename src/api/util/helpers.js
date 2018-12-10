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

    if (values[key] && arrayFields.includes(key)) {
      values[key] = values[key].split(';').map(item => item.trim());
    }
  }

  return values;
};

export const arrayToString = value => {
  if (value && Array.isArray(value)) {
    return value.join('; ');
  }

  return value;
};