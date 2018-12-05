import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';

export const getCountries = () => {
  return axios_cancelable.get(`${config.dataApi}/enumeration/basic/Country`, {
    headers: setHeaders()
  });
};