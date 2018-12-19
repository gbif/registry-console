import axios from 'axios';
import qs from 'qs';

import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';

export const institutionSearch = function (query) {
  return axios_cancelable.get(`${config.dataApi}/grbio/institution?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getInstitution = key => {
  return axios_cancelable.get(`${config.dataApi}/grbio/institution/${key}`, {
    headers: setHeaders()
  });
};