import axios from 'axios';
import qs from 'qs';

import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';

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