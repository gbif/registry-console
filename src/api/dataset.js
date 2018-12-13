import qs from 'qs';
import axios from 'axios';
import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';
import { getOrganization } from './organization';
import { getInstallation } from './installation';

export const searchDatasets = query => {
  return axios_cancelable.get(`${config.dataApi}/dataset?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const searchDeletedDatasets = query => {
  return axios_cancelable.get(`${config.dataApi}/dataset/deleted?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const searchDuplicateDatasets = query => {
  return axios_cancelable.get(`${config.dataApi}/dataset/duplicate?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const searchConstituentDatasets = query => {
  return axios_cancelable.get(`${config.dataApi}/dataset/constituents?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const searchDatasetsWithNoEndpoint = query => {
  return axios_cancelable.get(`${config.dataApi}/dataset/withNoEndpoint?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const createDataset = data => {
  return axios.post(`${config.dataApi}/dataset`, data, {
    headers: setHeaders()
  });
};

export const updateDataset = data => {
  return axios.put(`${config.dataApi}/dataset/${data.key}`, data, {
    headers: setHeaders()
  });
};

export const getDatasetOverview = async key => {
  const dataset = (await getDataset(key)).data;
  const constituents = (await getDatasetConstituents(key, {})).data;
  const publishingOrganization = (await getOrganization(dataset.publishingOrganizationKey)).data;
  const installation = (await getInstallation(dataset.installationKey)).data;
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
    constituents
  };
};

export const getDataset = key => {
  return axios.get(`${config.dataApi}/dataset/${key}`, {
    headers: setHeaders()
  });
};

export const getDatasetContacts = key => {
  return axios.get(`${config.dataApi}/dataset/${key}/contact`, {
    headers: setHeaders()
  });
};

export const getDatasetIdentifier = key => {
  return axios.get(`${config.dataApi}/dataset/${key}/identifier`, {
    headers: setHeaders()
  });
};

export const getDatasetEndpoint = key => {
  return axios.get(`${config.dataApi}/dataset/${key}/endpoint`, {
    headers: setHeaders()
  });
};

export const getDatasetTags = key => {
  return axios.get(`${config.dataApi}/dataset/${key}/tag`, {
    headers: setHeaders()
  });
};

export const getDatasetMachineTags = key => {
  return axios.get(`${config.dataApi}/dataset/${key}/machineTag`, {
    headers: setHeaders()
  });
};

export const getDatasetComment = key => {
  return axios.get(`${config.dataApi}/dataset/${key}/comment`, {
    headers: setHeaders()
  });
};

export const getDatasetConstituents = (key, query) => {
  return axios.get(`${config.dataApi}/dataset/${key}/constituents${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getDatasetProcess = (key, query) => {
  return axios.get(`${config.dataApi}/dataset/${key}/process${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const deleteContact = (key, contactKey) => {
  return axios.delete(`${config.dataApi}/dataset/${key}/contact/${contactKey}`, {
    headers: setHeaders()
  });
};

export const updateContact = (key, contactData) => {
  return axios.put(`${config.dataApi}/dataset/${key}/contact/${contactData.key}`, contactData, {
    headers: setHeaders()
  });
};

export const createContact = (key, contactData) => {
  return axios.post(`${config.dataApi}/dataset/${key}/contact`, contactData, {
    headers: setHeaders()
  });
};

export const deleteEndpoint = (key, endpointKey) => {
  return axios.delete(`${config.dataApi}/dataset/${key}/endpoint/${endpointKey}`, {
    headers: setHeaders()
  });
};

export const createEndpoint = (key, endpointData) => {
  return axios.post(`${config.dataApi}/dataset/${key}/endpoint`, endpointData, {
    headers: setHeaders()
  });
};

export const deleteIdentifier = (key, identifierKey) => {
  return axios.delete(`${config.dataApi}/dataset/${key}/identifier/${identifierKey}`, {
    headers: setHeaders()
  });
};

export const createIdentifier = (key, identifierData) => {
  return axios.post(`${config.dataApi}/dataset/${key}/identifier`, identifierData, {
    headers: setHeaders()
  });
};

export const deleteTag = (key, tagKey) => {
  return axios.delete(`${config.dataApi}/dataset/${key}/tag/${tagKey}`, {
    headers: setHeaders()
  });
};

export const createTag = (key, tagData) => {
  return axios.post(`${config.dataApi}/dataset/${key}/tag`, tagData, {
    headers: setHeaders()
  });
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axios.delete(`${config.dataApi}/dataset/${key}/machineTag/${machineTagKey}`, {
    headers: setHeaders()
  });
};

export const createMachineTag = (key, machineTagData) => {
  return axios.post(`${config.dataApi}/dataset/${key}/machineTag`, machineTagData, {
    headers: setHeaders()
  });
};

export const deleteComment = (key, commentKey) => {
  return axios.delete(`${config.dataApi}/dataset/${key}/comment/${commentKey}`, {
    headers: setHeaders()
  });
};

export const createComment = (key, commentData) => {
  return axios.post(`${config.dataApi}/dataset/${key}/comment`, commentData, {
    headers: setHeaders()
  });
};

export const getConstituentDataset = ({ key, query }) => {
  return axios_cancelable.get(`${config.dataApi}/dataset/${key}/constituents?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};
