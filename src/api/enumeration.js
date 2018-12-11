import axios from 'axios';

import config from './util/config';
import setHeaders from './util/setHeaders';

export const getCountries = () => {
  return axios.get(`${config.dataApi}/enumeration/basic/Country`, {
    headers: setHeaders()
  }).then(response => response.data);
};

export const getContactTypes = () => {
  return axios.get(`${config.dataApi}/enumeration/basic/ContactType`, {
    headers: setHeaders()
  }).then(response => response.data);
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