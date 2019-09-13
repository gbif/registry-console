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

// function shuffle(a) {
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }

export const pipelinesIngestionSearch = async () => {
  const runningIngestions = (await axiosInstance.get(`${config.dataApi_v1}/pipelines/process/running?_=${Date.now()}`)).data;

  // const runningIngestions = await testEndpoint();
  
  const requests = runningIngestions.map(ingestion => getDataset(ingestion.datasetKey));
  const datasets = await Promise.all(requests);


  runningIngestions.forEach((e, i) => {
    // No longer necessary after Marcos changed format
    // e.datasetKey = e.crawlId.substr(0, 36);
    // e.attempt = e.crawlId.substr(37);
    e.datasetTitle = datasets[i].data.title;
  });

  // shuffle(runningIngestions);
  return runningIngestions;
};

export const deleteCrawl = async (datasetKey, attempt) => {
  return axiosInstance.delete(`${config.dataApi_v1}/pipelines/process/running/${datasetKey}/${attempt}`)
}

// Nikolays changed response format v.3 feb 2019
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

// async function testEndpoint() {
//   return testData_2019_09_10;
// };

// Marcos changed response format sept 4 2019
// let testData_2019_09_4 = [
//   {
//     key: 0,
//     datasetKey: "06a00852-f764-4fb8-80d4-ca51f0918459",
//     attempt: 104,
//     datasetTitle: "UMNH Mammals Collection (Arctos)",
//     created: null,
//     steps: [
//       {
//         key: 0,
//         type: "VERBATIM_TO_INTERPRETED",
//         runner: "DISTRIBUTED",
//         started: "2019-09-04T11:22:54.991",
//         finished: null,
//         state: "RUNNING",
//         modified: null,
//         metrics: []
//       },
//       {
//         key: 0,
//         type: "DWCA_TO_VERBATIM",
//         runner: "STANDALONE",
//         started: "2019-09-04T11:22:38.867",
//         finished: "2019-09-04T11:22:52.654",
//         state: "COMPLETED",
//         message: "Next message has been sent - {\"datasetUuid\":\"4bfac3ea-8763-4f4b-a71a-76a6f5f243d3\",\"attempt\":245,\"pipelineSteps\":[\"INTERPRETED_TO_INDEX\",\"DWCA_TO_VERBATIM\",\"VERBATIM_TO_INTERPRETED\"],\"numberOfRecords\":2000000,\"runner\":null}",
//         modified: null,
//         metrics: []
//       }
//     ],
//     metrics: [
//     ]
//   }
// ];

// // Marcos changed response format sept 10 2019
// let testData_2019_09_10 = [
//   {
//   key: 0,
//   datasetKey: "418a6571-b6c1-4db0-b90e-8f36bde4c80e",
//   attempt: 119,
//   created: null,
//   steps: [
//   {
//   key: 0,
//   type: "DWCA_TO_VERBATIM",
//   runner: "STANDALONE",
//   started: "2019-09-13T07:53:49.523",
//   finished: "2019-09-13T07:53:50.551",
//   state: "COMPLETED",
//   message: "Next message has been sent - {\"datasetUuid\":\"4bfac3ea-8763-4f4b-a71a-76a6f5f243d3\",\"attempt\":245,\"pipelineSteps\":[\"INTERPRETED_TO_INDEX\",\"DWCA_TO_VERBATIM\",\"VERBATIM_TO_INTERPRETED\"],\"numberOfRecords\":2000000,\"runner\":null}",
//   modified: null,
//   metrics: [ ]
//   },
//   {
//   key: 0,
//   type: "VERBATIM_TO_INTERPRETED",
//   runner: "DISTRIBUTED",
//   started: "2019-09-13T07:57:37.779",
//   finished: null,
//   state: "RUNNING",
//   modified: null,
//   metrics: [ ]
//   }
//   ]
//   }
//   ];