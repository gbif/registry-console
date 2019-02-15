import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { collectionSearch } from './collection';

export const institutionSearch = (query, { type }) => {
  switch (type) {
    case 'deleted':
      return institutionDeleted(query);
    default:
      return axios_cancelable.get(`/grscicoll/institution?${qs.stringify(query)}`);
  }
};

export const institutionDeleted = query => {
  return axios_cancelable.get(`/grscicoll/institution/deleted?${qs.stringify(query)}`);
};

export const getInstitution = key => {
  return axios_cancelable.get(`/grscicoll/institution/${key}`);
};

export const getSuggestedInstitutions = async query => {
  if (isUUID(query.q)) {
    const institution = (await getInstitution(query.q)).data;
    return { data: [institution] };
  }
  return axios_cancelable.get(`/grscicoll/institution/suggest?${qs.stringify(query)}`);
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
  return axiosInstance.post(`/grscicoll/institution`, data);
};

export const updateInstitution = data => {
  return axiosInstance.put(`/grscicoll/institution/${data.key}`, data);
};

export const deleteInstitution = key => {
  return axiosInstance.delete(`/grscicoll/institution/${key}`);
};

export const deleteContact = (key, contactKey) => {
  return axiosInstance.delete(`/grscicoll/institution/${key}/contact/${contactKey}`);
};

export const addContact = (key, contactData) => {
  return axiosInstance.post(`/grscicoll/institution/${key}/contact`, contactData, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstance.delete(`/grscicoll/institution/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstance.post(`/grscicoll/institution/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstance.delete(`/grscicoll/institution/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstance.post(`/grscicoll/institution/${key}/tag`, tagData);
};