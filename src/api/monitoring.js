import axios from 'axios';

// import axiosInstance from './util/axiosInstance';
// import axios_cancelable from './util/axiosCancel';

export const overIngestedSearch = () => {
  // TODO return when dev API will be updated
  // return axios_cancelable.get(`/dataset/overcrawled?${qs.stringify(query)}`);
  return axios.get('https://api.gbif.org/v1/dataset/overcrawled');
};