import qs from 'qs';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { getInstitution, institutionSearch } from './institution';
import { collectionSearch, getCollection } from './collection';
import { isUUID } from '../components/util/helpers';

export const personSearch = query => {
  return axios_cancelable.get(`/grbio/person?${qs.stringify(query)}`);
};

export const personDeleted = query => {
  return axios_cancelable.get(`/grbio/person/deleted?${qs.stringify(query)}`);
};

export const getPerson = key => {
  return axios_cancelable.get(`/grbio/person/${key}`);
};

export const getSuggestedPersons = async query => {
  if (isUUID(query.q)) {
    const person = (await getPerson(query.q)).data;
    return { data: [person] };
  }
  return axios_cancelable.get(`/grbio/person/suggest?${qs.stringify(query)}`);
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
  return axiosInstance.post(`/grbio/person`, data);
};

export const updatePerson = data => {
  return axiosInstance.put(`/grbio/person/${data.key}`, data);
};

export const deletePerson = key => {
  return axiosInstance.delete(`/grbio/person/${key}`);
};