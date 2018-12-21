import axios from 'axios';
import qs from 'qs';

import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';
import { getInstitution } from './grbio.institution';

export const collectionSearch = query => {
  return axios_cancelable.get(`${config.dataApi}/grbio/collection?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getCollection = key => {
  return axios_cancelable.get(`${config.dataApi}/grbio/collection/${key}`, {
    headers: setHeaders()
  });
};

export const createCollection = data => {
  return axios.post(`${config.dataApi}/grbio/collection`, data,{
    headers: setHeaders()
  });
};

export const updateCollection = data => {
  return axios.put(`${config.dataApi}/grbio/collection/${data.key}`, data,{
    headers: setHeaders()
  });
};

export const getCollectionOverview = async key => {
  const collection = (await getCollection(key)).data;
  const institution = (await getInstitution(collection.institutionKey)).data;

  return {
    ...collection,
    institution: institution
  }
};

export const deleteContact = (key, contactKey) => {
  return axios.delete(`${config.dataApi}/grbio/collection/${key}/contact/${contactKey}`, {
    headers: setHeaders()
  });
};

export const updateContact = (key, contactData) => {
  return axios.put(`${config.dataApi}/grbio/collection/${key}/contact/${contactData.key}`, contactData, {
    headers: setHeaders()
  });
};

export const createContact = (key, contactData) => {
  return axios.post(`${config.dataApi}/grbio/collection/${key}/contact`, contactData, {
    headers: setHeaders()
  });
};

export const deleteIdentifier = (key, identifierKey) => {
  return axios.delete(`${config.dataApi}/grbio/collection/${key}/identifier/${identifierKey}`, {
    headers: setHeaders()
  });
};

export const createIdentifier = (key, identifierData) => {
  return axios.post(`${config.dataApi}/grbio/collection/${key}/identifier`, identifierData, {
    headers: setHeaders()
  });
};

export const deleteTag = (key, tagKey) => {
  return axios.delete(`${config.dataApi}/grbio/collection/${key}/tag/${tagKey}`, {
    headers: setHeaders()
  });
};

export const createTag = (key, tagData) => {
  return axios.post(`${config.dataApi}/grbio/collection/${key}/tag`, tagData, {
    headers: setHeaders()
  });
};