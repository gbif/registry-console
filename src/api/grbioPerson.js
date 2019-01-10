import qs from 'qs';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { getInstitution, institutionSearch } from './institution';
import { collectionSearch, getCollection } from './collection';

export const personSearch = query => {
  return axios_cancelable.get(`/grbio/person?${qs.stringify(query)}`);
};

export const getPerson = key => {
  return axios_cancelable.get(`/grbio/person/${key}`);
};

export const getPersonOverview = async key => {
  return Promise.all([
    getPerson(key),
    collectionSearch({ contact: key, limit: 0 }),
    institutionSearch({ contact: key, limit: 0 })
  ]).then(async responses => {
    const person = responses[0].data;

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
      collections: responses[1].data,
      institutions: responses[2].data
    }
  });
};

export const createPerson = data => {
  return axiosInstance.post(`/grbio/person`, data);
};

export const updatePerson = data => {
  return axiosInstance.put(`/grbio/person/${data.key}`, data);
};