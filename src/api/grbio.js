import qs from "qs";
import config from './util/config'
import axios_cancelable from './util/axiosCancel'
import setHeaders from './util/setHeaders'

export const collectionSearch = function(query) {
  return axios_cancelable.get(`${config.dataApi}/grbio/collection?${qs.stringify(query)}`, {
    headers: setHeaders()
  })
};

export const institutionSearch = function(query) {
  return axios_cancelable.get(`${config.dataApi}/grbio/institution?${qs.stringify(query)}`, {
    headers: setHeaders()
  })
};

export const personSearch = function(query) {
  return axios_cancelable.get(`${config.dataApi}/grbio/person?${qs.stringify(query)}`, {
    headers: setHeaders()
  })
};