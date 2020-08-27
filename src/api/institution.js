import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import axiosWithCrendetials_cancelable from './util/axiosCancelWithCredentials';
import { collectionSearch } from './collection';

export const institutionSearch = (query, filter) => {
  const type = filter ? filter.type : '';

  switch (type) {
    case 'deleted':
      return institutionDeleted(query);
    default:
      return axiosWithCrendetials_cancelable.get(`/grscicoll/institution?${qs.stringify(query)}`);
  }
};

export const institutionDeleted = query => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/institution/deleted?${qs.stringify(query)}`);
};

export const getInstitution = key => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/institution/${key}`);
};

export const getSuggestedInstitutions = async query => {
  if (isUUID(query.q)) {
    const institution = (await getInstitution(query.q)).data;
    return { data: [institution] };
  }
  return axiosWithCrendetials_cancelable.get(`/grscicoll/institution/suggest?${qs.stringify(query)}`);
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
  return axiosInstanceWithCredentials.post(`/grscicoll/institution`, data);
};

export const updateInstitution = data => {
  return axiosInstanceWithCredentials.put(`/grscicoll/institution/${data.key}`, data);
};

export const deleteInstitution = key => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/institution/${key}`);
};

export const deleteContact = (key, contactKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/institution/${key}/contact/${contactKey}`);
};

export const addContact = (key, contactData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution/${key}/contact`, contactData, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/institution/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/institution/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/institution/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution/${key}/machineTag`, machineTagData);
};