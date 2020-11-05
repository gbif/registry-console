import qs from 'qs';
import { isUUID } from 'validator';

import config from './util/config';
import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import axiosWithCrendetials_cancelable from './util/axiosCancelWithCredentials';
import axios_cancelable from './util/axiosCancel';
import { getOrganization } from './organization';
import { getInstallation } from './installation';

export const searchDatasets = (query, filter) => {
  const type = filter ? filter.type : '';

  switch (type) {
    case 'deleted':
      return searchDeletedDatasets(query);
    case 'duplicate':
      return searchDuplicateDatasets(query);
    case 'constituent':
      return searchConstituentDatasets(query);
    case 'withNoEndpoint':
      return searchDatasetsWithNoEndpoint(query);
    default:
      return axiosWithCrendetials_cancelable.get(`/dataset?${qs.stringify(query)}`);
  }
};

export const getDatasetSuggestions = async query => {
  if (isUUID(query.q)) {
    const dataset = (await getDataset(query.q)).data;
    return { data: [dataset] };
  }
  return axiosWithCrendetials_cancelable.get(`/dataset/suggest?${qs.stringify(query)}`);
};

export const searchDeletedDatasets = query => {
  return axiosWithCrendetials_cancelable.get(`/dataset/deleted?${qs.stringify(query)}`);
};

export const searchDuplicateDatasets = query => {
  return axiosWithCrendetials_cancelable.get(`/dataset/duplicate?${qs.stringify(query)}`);
};

export const searchConstituentDatasets = query => {
  return axiosWithCrendetials_cancelable.get(`/dataset/constituents?${qs.stringify(query)}`);
};

export const searchDatasetsWithNoEndpoint = query => {
  return axiosWithCrendetials_cancelable.get(`/dataset/withNoEndpoint?${qs.stringify(query)}`);
};

export const createDataset = data => {
  return axiosInstanceWithCredentials.post('/dataset', data);
};

export const updateDataset = data => {
  return axiosInstanceWithCredentials.put(`/dataset/${data.key}`, data);
};

export const deleteDataset = key => {
  return axiosInstanceWithCredentials.delete(`/dataset/${key}`);
};

export const getDatasetOverview = async key => {
  const [{ data: dataset }, { data: constituents }, { data: networks }, { data: process }, { data: pipelineHistory }] = await Promise.all([
    getDataset(key),
    getConstituentDataset(key, { limit: 0 }),
    getNetworks(key),
    getDatasetProcessHistory(key, { limit: 0 }),
    getDatasetPipelineHistory(key, { limit: 0 }),
  ]);
  const [{ data: publishingOrganization }, { data: installation }] = await Promise.all([
    getOrganization(dataset.publishingOrganizationKey),
    getInstallation(dataset.installationKey)
  ]);
  let parentDataset;
  let duplicateDataset;
  if (dataset.parentDatasetKey) {
    parentDataset = (await getDataset(dataset.parentDatasetKey)).data;
  }
  if (dataset.duplicateOfDatasetKey) {
    duplicateDataset = (await getDataset(dataset.duplicateOfDatasetKey)).data;
  }

  return {
    dataset: {
      ...dataset,
      publishingOrganization,
      installation,
      parentDataset,
      duplicateDataset
    },
    constituents,
    networks,
    process,
    pipelineHistory
  };
};

export const getDataset = key => {
  return axiosInstanceWithCredentials.get(`/dataset/${key}`);
};

export const getDatasetOccurrences = key => {
  return axios_cancelable.get(`${config.dataApi_v1}/occurrence/search?limit=0&datasetKey=${key}`);
};

export const getDatasetProcessHistory = (key, query) => {
  return axiosInstanceWithCredentials.get(`/dataset/${key}/process?${qs.stringify(query)}`);
};

export const getDatasetPipelineHistory = (key, query) => {
  return axiosInstanceWithCredentials.get(`/ingestion/history/${key}?${qs.stringify(query)}`);
};

export const deleteContact = (key, contactKey) => {
  return axiosInstanceWithCredentials.delete(`/dataset/${key}/contact/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstanceWithCredentials.put(`/dataset/${key}/contact/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstanceWithCredentials.post(`/dataset/${key}/contact`, contactData);
};

export const deleteEndpoint = (key, endpointKey) => {
  return axiosInstanceWithCredentials.delete(`/dataset/${key}/endpoint/${endpointKey}`);
};

export const createEndpoint = (key, endpointData) => {
  return axiosInstanceWithCredentials.post(`/dataset/${key}/endpoint`, endpointData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstanceWithCredentials.delete(`/dataset/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstanceWithCredentials.post(`/dataset/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstanceWithCredentials.delete(`/dataset/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstanceWithCredentials.post(`/dataset/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstanceWithCredentials.delete(`/dataset/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstanceWithCredentials.post(`/dataset/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstanceWithCredentials.delete(`/dataset/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstanceWithCredentials.post(`/dataset/${key}/comment`, commentData);
};

export const getConstituentDataset = (key, query) => {
  return axiosWithCrendetials_cancelable.get(`/dataset/${key}/constituents?${qs.stringify(query)}`);
};

export const getNetworks = key => {
  return axiosWithCrendetials_cancelable.get(`/dataset/${key}/networks`).then(response => {
    return {
      data: {
        count: response.data.length,
        limit: response.data.length,
        results: response.data
      }
    };
  });
};

export const crawlDataset = key => {
  return axiosInstanceWithCredentials.post(`/dataset/${key}/crawl`);
};

export const crawlDataset_pipeline = key => {
  return axiosInstanceWithCredentials.post(`/dataset/${key}/crawl?platform=PIPELINES`);
};

export const rerunSteps = ({datasetKey, steps, reason}) => {
  return axiosInstanceWithCredentials.post(`/pipelines/history/run/${datasetKey}?steps=${steps.join()}&reason=${reason}`);
};
