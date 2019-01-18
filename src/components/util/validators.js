import { isEmail, isMobilePhone, isURL, isPostalCode } from 'validator';

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

export const validatePostalCode = errorMessage => (rule, value, callback) => {
  if (value && !isPostalCode(value, 'any')) {
    callback(errorMessage);
  }
  callback();
};