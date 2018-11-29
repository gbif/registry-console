import qs from "qs";
import config from './util/config'
import axios_cancelable from './util/axiosCancel'
import setHeaders from './util/setHeaders'

export const search = function(query) {
  return axios_cancelable.get(`${config.dataApi}/node?${qs.stringify(query)}`, {
    headers: setHeaders()
  })
};
