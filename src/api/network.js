import qs from 'qs';

import axios_cancelable from './util/axiosCancel';

export const searchNetwork = query => {
  return axios_cancelable.get(`/network?${qs.stringify(query)}`);
};