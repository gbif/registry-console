import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { getInstitution, institutionSearch } from './institution';
import { collectionSearch, getCollection } from './collection';

export const personSearch = (query, filter) => {
  const type = filter ? filter.type : '';

  switch (type) {
    case 'deleted':
      return personDeleted(query);
    default:
      return axios_cancelable.get(`/grscicoll/person?${qs.stringify(query)}`);
  }
};

export const personDeleted = query => {
  return axios_cancelable.get(`/grscicoll/person/deleted?${qs.stringify(query)}`);
};

export const getPerson = key => {
  return axios_cancelable.get(`/grscicoll/person/${key}`);
};

export const getSuggestedPersons = async query => {
  if (isUUID(query.q)) {
    const person = (await getPerson(query.q)).data;
    return { data: [person] };
  }
  return axios_cancelable.get(`/grscicoll/person/suggest?${qs.stringify(query)}`);
};

export const getPersonOverview = async key => {
  const [{ data: person }, { data: collections }, { data: institutions }] = await Promise.all([
    getPerson(key),
    collectionSearch({ contact: key, limit: 0 }),
    institutionSearch({ contact: key, limit: 0 })
  ]);

  let institution;
  let collection;
  if (person.primaryInstitutionKey) {
    institution = (await getInstitution(person.primaryInstitutionKey)).data;
  }
  if (person.primaryCollectionKey) {
    collection = (await getCollection(person.primaryCollectionKey)).data;
  }

  return {
    person: {
      ...person,
      institution,
      collection
    },
    collections,
    institutions
  };
};

export const createPerson = data => {
  return axiosInstance.post(`/grscicoll/person`, data);
};

export const updatePerson = data => {
  return axiosInstance.put(`/grscicoll/person/${data.key}`, data);
};

export const deletePerson = key => {
  return axiosInstance.delete(`/grscicoll/person/${key}`);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstance.delete(`/grscicoll/person/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstance.post(`/grscicoll/person/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstance.delete(`/grscicoll/person/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstance.post(`/grscicoll/person/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstance.delete(`/grscicoll/person/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstance.post(`/grscicoll/person/${key}/machineTag`, machineTagData);
};