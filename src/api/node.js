import qs from 'qs';
import axios from 'axios';

import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';

export const search = function (query) {
  return axios_cancelable.get(`${config.dataApi}/node?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getNode = key => {
  return axios.get(`${config.dataApi}/node/${key}`, {
    headers: setHeaders()
  });
};
