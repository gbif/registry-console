import qs from "qs";
import axios from 'axios'
import config from './util/config'
import axios_cancelable from './util/axiosCancel'
import setHeaders from './util/setHeaders'

export const searchDatasets = function(query) {
  return axios_cancelable.get(`${config.dataApi}/dataset?${qs.stringify(query)}`, {
    headers: setHeaders()
  })
};

export const searchDeletedDatasets = function(query) {
  return axios_cancelable.get(`${config.dataApi}/dataset/deleted?${qs.stringify(query)}`, {
    headers: setHeaders()
  })
};

export const searchDuplicateDatasets = function(query) {
  return axios_cancelable.get(`${config.dataApi}/dataset/duplicate?${qs.stringify(query)}`, {
    headers: setHeaders()
  })
};

export const searchDatasetsWithNoEndpoint = function(query) {
  return axios_cancelable.get(`${config.dataApi}/dataset/withNoEndpoint?${qs.stringify(query)}`, {
    headers: setHeaders()
  })
};

export const updateDataset = function(data) {
  return axios.put(`${config.dataApi}/dataset/${data.key}`, data, {
    headers: setHeaders()
  })
};

export const getDatasetOverview = async function(key) {
  const dataset = (await getDataset(key)).data
  const constituents = (await getDatasetConstituents(key, {})).data
  return {
    dataset,
    constituents
  }
}

export const getDataset = function(key) {
  return axios.get(`${config.dataApi}/dataset/${key}`, {
    headers: setHeaders()
  })
};

export const getDatasetContacts = function(key) {
  return axios.get(`${config.dataApi}/dataset/${key}/contact`, {
    headers: setHeaders()
  })
};

export const getDatasetIdentifier = function(key) {
  return axios.get(`${config.dataApi}/dataset/${key}/identifier`, {
    headers: setHeaders()
  })
};

export const getDatasetEndpoint = function(key) {
  return axios.get(`${config.dataApi}/dataset/${key}/endpoint`, {
    headers: setHeaders()
  })
};

export const getDatasetTags = function(key) {
  return axios.get(`${config.dataApi}/dataset/${key}/tag`, {
    headers: setHeaders()
  })
};

export const getDatasetMachineTags = function(key) {
  return axios.get(`${config.dataApi}/dataset/${key}/machineTag`, {
    headers: setHeaders()
  })
};

export const getDatasetComment = function(key) {
  return axios.get(`${config.dataApi}/dataset/${key}/comment`, {
    headers: setHeaders()
  })
};

export const getDatasetConstituents = function(key, query) {
  return axios.get(`${config.dataApi}/dataset/${key}/constituents${qs.stringify(query)}`, {
    headers: setHeaders()
  })
};

export const getDatasetProcess = function(key, query) {
  return axios.get(`${config.dataApi}/dataset/${key}/process${qs.stringify(query)}`, {
    headers: setHeaders()
  })
};
