import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import config from './util/config';
import { getDataset, getDatasetOccurrences } from './dataset';

export const overIngestedSearch = () => {
  return axios_cancelable.get(`${config.dataApi_v1}/dataset/overcrawled`);
};

export const ingestionSearch = async () => {
  const runningIngestions =  (await axiosInstance.get(`${config.dataApi_v1}/dataset/process/running?_=${Date.now()}`)).data;
  const requests = runningIngestions.map(ingestion => getDataset(ingestion.datasetKey));
  const countRequests = runningIngestions.map(ingestion => getDatasetOccurrences(ingestion.datasetKey));
  const result = await Promise.all(requests);
  const countResult = await Promise.all(countRequests);

  for (let i = 0; i < runningIngestions.length; i++) {
    runningIngestions[i].dataset = result[i].data;
    runningIngestions[i].dataset.count = countResult[i].data.count;
  }

  return runningIngestions;
};

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const pipelinesIngestionSearch = async () => {
  const runningIngestions =  (await axiosInstance.get(`${config.dataApi_v1}/pipelines/process/running?_=${Date.now()}`)).data;
  console.log('get data');
  // const runningIngestions = await testEndpoint();
  runningIngestions.forEach(e => {
    e.datasetKey = e.crawlId.substr(0,36);
    e.attempt = e.crawlId.substr(37);
  });

  shuffle(runningIngestions);
  return runningIngestions;
};

export const deleteCrawl = async crawlId => {
  return axiosInstance.delete(`${config.dataApi_v1}/pipelines/process/crawlId/${crawlId}`)
}
