import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { getInstitution } from './institution';

export const collectionSearch = (query, { type }) => {
  switch (type) {
    case 'deleted':
      return collectionDeleted(query);
    default:
      return axios_cancelable.get(`/grscicoll/collection?${qs.stringify(query)}`);
  }
};

export const collectionDeleted = query => {
  return axios_cancelable.get(`/grscicoll/collection/deleted?${qs.stringify(query)}`);
};

export const getCollection = key => {
  return axios_cancelable.get(`/grscicoll/collection/${key}`);
};

export const getSuggestedCollections = async query => {
  if (isUUID(query.q)) {
    const collection = (await getCollection(query.q)).data;
    return { data: [collection] };
  }
  return axios_cancelable.get(`/grscicoll/collection/suggest?${qs.stringify(query)}`);
};

export const createCollection = data => {
  return axiosInstance.post(`/grscicoll/collection`, data);
};

export const updateCollection = data => {
  return axiosInstance.put(`/grscicoll/collection/${data.key}`, data);
};

export const deleteCollection = key => {
  return axiosInstance.delete(`/grscicoll/collection/${key}`);
};

export const getCollectionOverview = async key => {
  const collection = (await getCollection(key)).data;
  let institution;
  if (collection.institutionKey) {
    institution = (await getInstitution(collection.institutionKey)).data;
  }

  return {
    ...collection,
    institution
  }
};

export const deleteContact = (key, contactKey) => {
  return axiosInstance.delete(`/grscicoll/collection/${key}/contact/${contactKey}`);
};

export const addContact = (key, contactData) => {
  return axiosInstance.post(`/grscicoll/collection/${key}/contact`, contactData, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstance.delete(`/grscicoll/collection/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstance.post(`/grscicoll/collection/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstance.delete(`/grscicoll/collection/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstance.post(`/grscicoll/collection/${key}/tag`, tagData);
};