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
  // return running;
  const runningIngestions = (await axiosInstance.get(`${config.dataApi_v1}/pipelines/process/running?_=${Date.now()}`)).data;
  return runningIngestions;
};

export const pipelinesDatasetHistorySearch = async (datasetKey, query) => {
  const runningIngestions = (await axiosInstance.get(`${config.dataApi_v1}/ingestion/history/${datasetKey}?_=${Date.now()}&${qs.stringify(query)}`)).data;
  return runningIngestions;
}

export const pipelinesHistorySearch = async query => {
  const runningIngestions = (await axiosInstance.get(`${config.dataApi_v1}/pipelines/history?_=${Date.now()}&${qs.stringify(query)}`)).data;
  return runningIngestions;
}

export const deleteCrawl = async (datasetKey, attempt) => {
  return axiosInstance.delete(`${config.dataApi_v1}/pipelines/process/running/${datasetKey}`)
}

// var running = [
//   {
//     "key": 0,
//     "datasetKey": "4bfac3ea-8763-4f4b-a71a-76a6f5f243d3",
//     "datasetTitle": "Museum of Comparative Zoology, Harvard University",
//     "attempt": 355,
//     "executions": [
//       {
//         "key": 3099,
//         "steps": [
//           {
//             "key": 0,
//             "type": "VERBATIM_TO_INTERPRETED",
//             "runner": "DISTRIBUTED",
//             "started": "2019-12-11T09:22:11.644",
//             "finished": null,
//             "state": "RUNNING",
//             "message": "{\"datasetUuid\":\"4bfac3ea-8763-4f4b-a71a-76a6f5f243d3\",\"attempt\":355,\"interpretTypes\":[\"ALL\"],\"pipelineSteps\":[\"HDFS_VIEW\",\"INTERPRETED_TO_INDEX\",\"DWCA_TO_VERBATIM\",\"VERBATIM_TO_INTERPRETED\"],\"runner\":\"DISTRIBUTED\",\"endpointType\":\"DWC_ARCHIVE\",\"extraPath\":null,\"validationResult\":{\"tripletValid\":true,\"occurrenceIdValid\":true,\"useExtendedRecordId\":null,\"numberOfRecords\":2000000},\"resetPrefix\":null,\"executionId\":3099}"
//           },
//           {
//             "key": 0,
//             "type": "DWCA_TO_VERBATIM",
//             "runner": "STANDALONE",
//             "started": "2019-12-11T09:13:04.348",
//             "finished": "2019-12-11T09:21:47.197",
//             "state": "COMPLETED",
//             "message": "{\"datasetUuid\":\"4bfac3ea-8763-4f4b-a71a-76a6f5f243d3\",\"datasetType\":\"OCCURRENCE\",\"source\":\"http://digir.mcz.harvard.edu/ipt/archive.do?r=mczbase\",\"attempt\":355,\"validationReport\":{\"datasetKey\":\"4bfac3ea-8763-4f4b-a71a-76a6f5f243d3\",\"occurrenceReport\":{\"checkedRecords\":2000000,\"uniqueTriplets\":2000000,\"allRecordsChecked\":false,\"recordsWithInvalidTriplets\":0,\"uniqueOccurrenceIds\":2000000,\"recordsMissingOccurrenceId\":0,\"invalidationReason\":null,\"valid\":true},\"genericReport\":null,\"invalidationReason\":null,\"valid\":true},\"pipelineSteps\":[\"DWCA_TO_VERBATIM\",\"HDFS_VIEW\",\"VERBATIM_TO_INTERPRETED\",\"INTERPRETED_TO_INDEX\"],\"endpointType\":\"DWC_ARCHIVE\",\"platform\":\"ALL\",\"executionId\":null}"
//           }
//         ]
//       }
//     ]
//   }
// ];
