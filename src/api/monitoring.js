import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';

import { getDataset } from './dataset';

export const overIngestedSearch = () => {
  return axios_cancelable.get('/dataset/overcrawled');
};

export const ingestionSearch = async () => {
  const runningIngestions =  ( await axiosInstance.get(`/dataset/process/running?_=${Date.now()}`)).data;
  const requests = runningIngestions.map(ingestion => getDataset(ingestion.datasetKey));
  const result = await Promise.all(requests);

  for (let i = 0; i < runningIngestions.length; i++) {
    runningIngestions[i].dataset = result[i].data;
  }

  return runningIngestions;
};