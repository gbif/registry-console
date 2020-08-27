import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import axiosWithCrendetials_cancelable from './util/axiosCancelWithCredentials';
import { getInstitution } from './institution';

export const collectionSearch = (query, filter) => {
  const type = filter ? filter.type : '';

  switch (type) {
    case 'deleted':
      return collectionDeleted(query);
    default:
      return axiosWithCrendetials_cancelable.get(`/grscicoll/collection?${qs.stringify(query)}`);
  }
};

export const collectionDeleted = query => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/collection/deleted?${qs.stringify(query)}`);
};

export const getCollection = key => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/collection/${key}`);
};

export const getSuggestedCollections = async query => {
  if (isUUID(query.q)) {
    const collection = (await getCollection(query.q)).data;
    return { data: [collection] };
  }
  return axiosWithCrendetials_cancelable.get(`/grscicoll/collection/suggest?${qs.stringify(query)}`);
};

export const createCollection = data => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection`, data);
};

export const updateCollection = data => {
  return axiosInstanceWithCredentials.put(`/grscicoll/collection/${data.key}`, data);
};

export const deleteCollection = key => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}`);
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
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}/contact/${contactKey}`);
};

export const addContact = (key, contactData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${key}/contact`, contactData, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${key}/machineTag`, machineTagData);
};