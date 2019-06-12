import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { TaskQueue } from 'cwait';
import config from './util/config';
import { getDataset, getDatasetOccurrences } from './dataset';

let datasetTitleMap = {};

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

export const pipelinesIngestionSearch = async () => {
  const runningIngestions =  (await axiosInstance.get(`${config.dataApi_v1}/pipelines/process/running?_=${Date.now()}`)).data;
  console.log('get data');
  // const runningIngestions = await testEndpoint();
  runningIngestions.forEach(e => {
    e.datasetKey = e.crawlId.substr(0,36);
    e.attempt = e.crawlId.substr(37);
  });

  return runningIngestions;
};

export const getDatasetTitles = async datasetKeys => {
  const MAX_SIMULTANEOUS_DOWNLOADS = 6;
  const queue = new TaskQueue(Promise, MAX_SIMULTANEOUS_DOWNLOADS);
  await Promise.all(datasetKeys.map(queue.wrap(async key => {
    if (datasetTitleMap[key]) return datasetTitleMap[key];
    let title = (await axiosInstance.get(`${config.dataApi_v1}/dataset/${key}`)).data.title;
    datasetTitleMap[key] = title;
    return title;
  })));
  return datasetTitleMap;
}

async function testEndpoint() {
  return [
    {
      "crawlId": "76dd8f0d-2daa-4a69-9fcd-55e04230334a_99",
      "pipelinesSteps": [
        {
          "name": "dwcaToVerbatm",
          "startDateTime": {
            "hour": 7,
            "minute": 24,
            "second": 34,
            "nano": 37000000,
            "dayOfYear": 99,
            "dayOfWeek": "TUESDAY",
            "month": "APRIL",
            "dayOfMonth": 9,
            "year": 2019,
            "monthValue": 4,
            "chronology": {
              "id": "ISO",
              "calendarType": "iso8601"
            }
          },
          "error": {
            "availability": false,
            "message": ""
          },
          "successful": {
            "availability": true,
            "message": "Next message has been sent - {\"datasetUuid\":\"76dd8f0d-2daa-4a69-9fcd-55e04230334a\",\"attempt\":99,\"interpretTypes\":[\"ALL\"],\"pipelineSteps\":[\"ALL\"],\"runner\":null}"
          },
          "step": {
            "present": true
          }
        },
        {
          "name": "dwcaToInterpreted",
          "startDateTime": {
            "hour": 8,
            "minute": 24,
            "second": 34,
            "nano": 37000000,
            "dayOfYear": 99,
            "dayOfWeek": "TUESDAY",
            "month": "APRIL",
            "dayOfMonth": 9,
            "year": 2019,
            "monthValue": 4,
            "chronology": {
              "id": "ISO",
              "calendarType": "iso8601"
            }
          },
          "error": {
            "availability": false,
            "message": ""
          },
          "successful": {
            "availability": true,
            "message": "Next message has been sent too"
          },
          "step": {
            "present": false
          }
        }
      ],
      "metricInfos": [
        {
          "name": "extension.AudubonTransform.audubonRecordsCount",
          "value": "14"
        },
        {
          "name": "extension.MultimediaTransform.multimediaRecordsCount",
          "value": "14"
        },
        {
          "name": "core.TaxonomyTransform.taxonRecordsCount",
          "value": "14"
        },
        {
          "name": "specific.AustraliaSpatialTransform.australiaSpatialRecordsCount",
          "value": "14"
        },
        {
          "name": "core.LocationTransform.locationRecordsCount",
          "value": "14"
        },
        {
          "name": "core.MetadataTransform.metadataRecordsCount",
          "value": "1"
        },
        {
          "name": "core.BasicTransform.basicRecordsCount",
          "value": "14"
        },
        {
          "name": "extension.MeasurementOrFactTransform.measurementOrFactRecordsCount",
          "value": "14"
        },
        {
          "name": "UniqueIdTransform.uniqueIdsCount",
          "value": "14"
        },
        {
          "name": "extension.ImageTransform.imageRecordsCount",
          "value": "14"
        }
      ]
    }
  ]
}