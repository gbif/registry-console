import axios from 'axios';
import qs from 'qs';

import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';

export const institutionSearch = query => {
  return axios_cancelable.get(`${config.dataApi}/grbio/institution?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getInstitution = key => {
  return axios_cancelable.get(`${config.dataApi}/grbio/institution/${key}`, {
    headers: setHeaders()
  });
};

export const createInstitution = data => {
  return axios.post(`${config.dataApi}/grbio/institution`, data,{
    headers: setHeaders()
  });
};

export const updateInstitution = data => {
  return axios.put(`${config.dataApi}/grbio/institution/${data.key}`, data, {
    headers: setHeaders()
  });
};

export const deleteContact = (key, contactKey) => {
  return axios.delete(`${config.dataApi}/grbio/institution/${key}/contact/${contactKey}`, {
    headers: setHeaders()
  });
};

export const updateContact = (key, contactData) => {
  return axios.put(`${config.dataApi}/grbio/institution/${key}/contact/${contactData.key}`, contactData, {
    headers: setHeaders()
  });
};

export const createContact = (key, contactData) => {
  return axios.post(`${config.dataApi}/grbio/institution/${key}/contact`, contactData, {
    headers: setHeaders()
  });
};

export const deleteIdentifier = (key, identifierKey) => {
  return axios.delete(`${config.dataApi}/grbio/institution/${key}/identifier/${identifierKey}`, {
    headers: setHeaders()
  });
};

export const createIdentifier = (key, identifierData) => {
  return axios.post(`${config.dataApi}/grbio/institution/${key}/identifier`, identifierData, {
    headers: setHeaders()
  });
};

export const deleteTag = (key, tagKey) => {
  return axios.delete(`${config.dataApi}/grbio/institution/${key}/tag/${tagKey}`, {
    headers: setHeaders()
  });
};

export const createTag = (key, tagData) => {
  return axios.post(`${config.dataApi}/grbio/institution/${key}/tag`, tagData, {
    headers: setHeaders()
  });
};