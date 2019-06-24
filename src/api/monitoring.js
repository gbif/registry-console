import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import config from './util/config';
import { getDataset, getDatasetOccurrences } from './dataset';

export const overIngestedSearch = () => {
  return axios_cancelable.get(`${config.dataApi_v1}/dataset/overcrawled`);
};

export const ingestionSearch = async () => {
  const runningIngestions = (await axiosInstance.get(`${config.dataApi_v1}/dataset/process/running?_=${Date.now()}`)).data;
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
  const runningIngestions = (await axiosInstance.get(`${config.dataApi_v1}/pipelines/process/running?_=${Date.now()}`)).data;
  console.log('get data');
  // const runningIngestions = await testEndpoint();
  runningIngestions.forEach(e => {
    e.datasetKey = e.crawlId.substr(0, 36);
    e.attempt = e.crawlId.substr(37);
  });

  shuffle(runningIngestions);
  return runningIngestions;
};

export const deleteCrawl = async crawlId => {
  return axiosInstance.delete(`${config.dataApi_v1}/pipelines/process/crawlId/${crawlId}`)
}


// const exampleResponse = [
//   {
//     "crawlId": "4bfac3ea-8763-4f4b-a71a-76a6f5f243d3_245",
//     "datasetKey": "4bfac3ea-8763-4f4b-a71a-76a6f5f243d3",
//     "attempt": "245",
//     "datasetTitle": "Museum of Comparative Zoology, Harvard University",
//     "steps": [
//       {
//         "name": "dwcaToVerbatim",
//         "runner": "STANDALONE",
//         "started": "2019-06-24T08:55:01.360",
//         "finished": "2019-06-24T09:03:15.617",
//         "state": "COMPLETED",
//         "message": "Next message has been sent - {\"datasetUuid\":\"4bfac3ea-8763-4f4b-a71a-76a6f5f243d3\",\"attempt\":245,\"interpretTypes\":[\"ALL\"],\"pipelineSteps\":[\"VERBATIM_TO_INTERPRETED\",\"DWCA_TO_VERBATIM\",\"INTERPRETED_TO_INDEX\"],\"runner\":null,\"endpointType\":\"DWC_ARCHIVE\",\"extraPath\":null,\"validationResult\":{\"tripletValid\":true,\"occurrenceIdValid\":true,\"useExtendedRecordId\":null,\"numberOfRecords\":2000000}}",
//         "step": {
//           "present": true
//         }
//       },
//       {
//         "name": "verbatimToInterpreted",
//         "runner": "DISTRIBUTED",
//         "started": "2019-06-24T09:03:17.052",
//         "finished": "2019-06-24T09:03:57.273",
//         "state": "COMPLETED",
//         "message": "Next message has been sent - {\"datasetUuid\":\"4bfac3ea-8763-4f4b-a71a-76a6f5f243d3\",\"attempt\":245,\"pipelineSteps\":[\"INTERPRETED_TO_INDEX\",\"DWCA_TO_VERBATIM\",\"VERBATIM_TO_INTERPRETED\"],\"numberOfRecords\":2000000,\"runner\":null}",
//         "step": {
//           "present": true
//         }
//       },
//       {
//         "name": "interpretedToIndex",
//         "runner": "DISTRIBUTED",
//         "started": "2019-06-24T09:03:57.514",
//         "state": "FAILED",
//         "message": "Error for crawlId - 4bfac3ea-8763-4f4b-a71a-76a6f5f243d3_245 : Failed indexing on 4bfac3ea-8763-4f4b-a71a-76a6f5f243d3",
//         "step": {
//           "present": true
//         }
//       }
//     ],
//     "metrics": [
//       {
//         "name": "core.MetadataTransform.metadataRecordsCount",
//         "value": "1"
//       }
//     ]
//   }
// ];