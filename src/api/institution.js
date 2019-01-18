import qs from 'qs';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { collectionSearch } from './collection';
import { isUUID } from '../components/util/helpers';

export const institutionSearch = query => {
  return axios_cancelable.get(`/grbio/institution?${qs.stringify(query)}`);
};

export const institutionDeleted = query => {
  return axios_cancelable.get(`/grbio/institution/deleted?${qs.stringify(query)}`);
};

export const getInstitution = key => {
  return axios_cancelable.get(`/grbio/institution/${key}`);
};

export const getSuggestedInstitutions = async query => {
  if (isUUID(query.q)) {
    const institution = (await getInstitution(query.q)).data;
    return { data: [institution] };
  }
  return axios_cancelable.get(`/grbio/institution/suggest?${qs.stringify(query)}`);
};

export const getInstitutionOverview = async key => {
  const [{ data: institution }, { data: collections }] = await Promise.all([
    getInstitution(key),
    collectionSearch({ institution: key, limit: 0 })
  ]);

  return {
    institution,
    collections
  };
};

export const createInstitution = data => {
  return axiosInstance.post(`/grbio/institution`, data);
};

export const updateInstitution = data => {
  return axiosInstance.put(`/grbio/institution/${data.key}`, data);
};

export const deleteInstitution = key => {
  return axiosInstance.delete(`/grbio/institution/${key}`);
};

export const deleteContact = (key, contactKey) => {
  return axiosInstance.delete(`/grbio/institution/${key}/contact/${contactKey}`);
};

export const addContact = (key, contactData) => {
  return axiosInstance.post(`/grbio/institution/${key}/contact`, contactData, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstance.delete(`/grbio/institution/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstance.post(`/grbio/institution/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstance.delete(`/grbio/institution/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstance.post(`/grbio/institution/${key}/tag`, tagData);
};