import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import config from './util/config';
import { getDataset } from './dataset';

export const overIngestedSearch = () => {
  return axios_cancelable.get(`${config.dataApi_v1}/dataset/overcrawled`);
};

export const ingestionSearch = async () => {
  const runningIngestions =  (await axiosInstance.get(`${config.dataApi_v1}/dataset/process/running?_=${Date.now()}`)).data;
  const requests = runningIngestions.map(ingestion => getDataset(ingestion.datasetKey));
  const result = await Promise.all(requests);

  for (let i = 0; i < runningIngestions.length; i++) {
    runningIngestions[i].dataset = result[i].data;
  }

  return runningIngestions;
};