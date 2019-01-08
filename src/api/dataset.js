import qs from 'qs';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { getOrganization } from './organization';
import { getInstallation } from './installation';

export const searchDatasets = query => {
  return axios_cancelable.get(`/dataset?${qs.stringify(query)}`);
};

export const getDatasetSuggestions = query => {
  return axios_cancelable.get(`/dataset/suggest?${qs.stringify(query)}`);
};

export const searchDeletedDatasets = query => {
  return axios_cancelable.get(`/dataset/deleted?${qs.stringify(query)}`);
};

export const searchDuplicateDatasets = query => {
  return axios_cancelable.get(`/dataset/duplicate?${qs.stringify(query)}`);
};

export const searchConstituentDatasets = query => {
  return axios_cancelable.get(`/dataset/constituents?${qs.stringify(query)}`);
};

export const searchDatasetsWithNoEndpoint = query => {
  return axios_cancelable.get(`/dataset/withNoEndpoint?${qs.stringify(query)}`);
};

export const createDataset = data => {
  return axiosInstance.post('/dataset', data);
};

export const updateDataset = data => {
  return axiosInstance.put(`/dataset/${data.key}`, data);
};

export const getDatasetOverview = async key => {
  const dataset = (await getDataset(key)).data;
  const constituents = (await getConstituentDataset({key, limit:0})).data;
  const publishingOrganization = (await getOrganization(dataset.publishingOrganizationKey)).data;
  const installation = (await getInstallation(dataset.installationKey)).data;
  const process = (await getDatasetProcessHistory(key, {limit:0})).data;
  let parentDataset;
  let duplicateDataset;
  if (dataset.parentDatasetKey) {
    parentDataset = (await getDataset(dataset.parentDatasetKey)).data;
  }
  if (dataset.duplicateDatasetKey) {
    duplicateDataset = (await getDataset(dataset.duplicateDatasetKey)).data;
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
    process
  };
};

export const getDataset = key => {
  return axiosInstance.get(`/dataset/${key}`);
};

export const getDatasetConstituents = (key, query) => {
  return axiosInstance.get(`/dataset/${key}/constituents${qs.stringify(query)}`);
};

export const getDatasetProcessHistory = (key, query) => {
  return axiosInstance.get(`/dataset/${key}/process?${qs.stringify(query)}`);
};

export const deleteContact = (key, contactKey) => {
  return axiosInstance.delete(`/dataset/${key}/contact/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstance.put(`/dataset/${key}/contact/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstance.post(`/dataset/${key}/contact`, contactData);
};

export const deleteEndpoint = (key, endpointKey) => {
  return axiosInstance.delete(`/dataset/${key}/endpoint/${endpointKey}`);
};

export const createEndpoint = (key, endpointData) => {
  return axiosInstance.post(`/dataset/${key}/endpoint`, endpointData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstance.delete(`/dataset/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstance.post(`/dataset/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstance.delete(`/dataset/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstance.post(`/dataset/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstance.delete(`/dataset/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstance.post(`/dataset/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstance.delete(`/dataset/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstance.post(`/dataset/${key}/comment`, commentData);
};

export const getConstituentDataset = ({ key, query }) => {
  return axios_cancelable.get(`/dataset/${key}/constituents?${qs.stringify(query)}`);
};

export const crawlDataset = key => {
  return axiosInstance.post(`/dataset/${key}/crawl`);
};
