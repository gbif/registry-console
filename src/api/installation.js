import qs from 'qs';
import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';

export const search = query => {
  return axios_cancelable.get(`${config.dataApi}/installation?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const deleted = query => {
  return axios_cancelable.get(`${config.dataApi}/installation/deleted?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const nonPublishing = query => {
  return axios_cancelable.get(`${config.dataApi}/installation/nonPublishing?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getInstallation = key => {
  return axios_cancelable.get(`${config.dataApi}/installation/${key}`, {
    headers: setHeaders()
  });
};