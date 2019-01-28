import axios from 'axios';

// import axiosInstance from './util/axiosInstance';
// import axios_cancelable from './util/axiosCancel';
import { getDataset } from './dataset';

export const overIngestedSearch = () => {
  // TODO return when dev API will be updated
  // return axios_cancelable.get(`/dataset/overcrawled?${qs.stringify(query)}`);
  return axios.get('https://api.gbif.org/v1/dataset/overcrawled');
};

export const ingestionSearch = async () => {
  // TODO return when dev API will be updated
  // return axios_cancelable.get(`/dataset/process/running?_=${Date.now()}`);
  const runningIngestions =  ( await axios.get(`https://api.gbif.org/v1/dataset/process/running?_=${Date.now()}`)).data;
  const requests = runningIngestions.map(ingestion => getDataset(ingestion.datasetKey));
  const result = await Promise.all(requests);

  for (let i = 0; i < runningIngestions.length; i++) {
    runningIngestions[i].dataset = result[i].data;
  }

  return runningIngestions;
};