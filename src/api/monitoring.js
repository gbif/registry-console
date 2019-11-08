import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import config from './util/config';
import { getDataset, getDatasetOccurrences } from './dataset';
import qs from 'qs';
import { eachLimit } from './util/util';


export const overIngestedSearch = () => {
  return axios_cancelable.get(`${config.dataApi_v1}/dataset/overcrawled`);
};

const decorateIngestion = async ingestion => {
  const dataset = await getDataset(ingestion.datasetKey)
  const occ = await getDatasetOccurrences(ingestion.datasetKey)
  ingestion.dataset = { ...dataset.data, count: occ.data.count };
}

export const ingestionSearch = async () => {
  const runningIngestions = (await axiosInstance.get(`${config.dataApi_v1}/dataset/process/running?_=${Date.now()}`)).data;
  await eachLimit(runningIngestions, 10, decorateIngestion)
  return runningIngestions;
};

export const pipelinesIngestionSearch = async () => {
  //this endpoint do not support any type of queries
  const runningIngestions = (await axiosInstance.get(`${config.dataApi_v1}/pipelines/process/running?_=${Date.now()}`)).data;
  return runningIngestions;
};

export const pipelinesDatasetHistorySearch = async (datasetKey, query) => {
  const runningIngestions = (await axiosInstance.get(`${config.dataApi_v1}/pipelines/history/${datasetKey}?_=${Date.now()}&${qs.stringify(query)}`)).data;
  return runningIngestions;
}

export const pipelinesHistorySearch = async query => {
  const runningIngestions = (await axiosInstance.get(`${config.dataApi_v1}/pipelines/history?_=${Date.now()}&${qs.stringify(query)}`)).data;
  return runningIngestions;
}

export const deleteCrawl = async (datasetKey, attempt) => {
  return axiosInstance.delete(`${config.dataApi_v1}/pipelines/process/running/${datasetKey}/${attempt}`)
}