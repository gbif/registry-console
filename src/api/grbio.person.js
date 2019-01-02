import axios from 'axios';
import qs from 'qs';

import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';
import { getInstitution } from './grbio.institution';
import { getCollection } from './grbio.collection';

export const personSearch = query => {
  return axios_cancelable.get(`${config.dataApi}/grbio/person?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getPerson = key => {
  return axios_cancelable.get(`${config.dataApi}/grbio/person/${key}`, {
    headers: setHeaders()
  });
};

export const getPersonOverview = async key => {
  const person = (await getPerson(key)).data;

  let institution;
  let collection;
  if (person.primaryInstitutionKey) {
    institution = (await getInstitution(person.primaryInstitutionKey)).data;
  }
  if (person.primaryCollectionKey) {
    collection = (await getCollection(person.primaryCollectionKey)).data;
  }

  return {
    ...person,
    institution,
    collection
  }
};

export const createPerson = data => {
  return axios.post(`${config.dataApi}/grbio/person`, data, {
    headers: setHeaders()
  });
};

export const updatePerson = data => {
  return axios.put(`${config.dataApi}/grbio/person/${data.key}`, data, {
    headers: setHeaders()
  });
};