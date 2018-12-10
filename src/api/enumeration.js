import axios from 'axios';

import config from './util/config';
import setHeaders from './util/setHeaders';
import { prettifyCountry, prettifyUserType } from './util/prettifiers';

export const getCountries = () => {
  return axios.get(`${config.dataApi}/enumeration/basic/Country`, {
    headers: setHeaders()
  }).then(response => {
    return response.data.map(code => ({
      code,
      name: prettifyCountry(code)
    }));
  });
};

export const getContactTypes = () => {
  return axios.get(`${config.dataApi}/enumeration/basic/ContactType`, {
    headers: setHeaders()
  }).then(response => {
    return response.data.map(code => ({
      code,
      name: prettifyUserType(code)
    }));
  });
};

export const getLanguages = () => {
  return axios.get(`${config.dataApi}/enumeration/basic/Language`, {
    headers: setHeaders()
  }).then(response => response.data);
};

export const getEndpointTypes = () => {
  return axios.get(`${config.dataApi}/enumeration/basic/EndpointType`, {
    headers: setHeaders()
  }).then(response => response.data);
};

export const getIdentifierTypes = () => {
  return axios.get(`${config.dataApi}/enumeration/basic/IdentifierType`, {
    headers: setHeaders()
  }).then(response => response.data);
};