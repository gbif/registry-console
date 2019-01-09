import qs from 'qs';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';

export const search = query => {
  return axios_cancelable.get(`/node?${qs.stringify(query)}`);
};

export const getNodeSuggestions = query => {
  return axios_cancelable.get(`/node/suggest?q=${query}`);
};

export const getNode = key => {
  return axiosInstance.get(`/node/${key}`);
};

export const getNodeOverview = async key => {
  return Promise.all([
    getNode(key),
    getPendingEndorsement(key, { limit: 0 }),
    getEndorsedOrganizations(key, { limit: 0 }),
    getEndorsedDatasets(key, { limit: 0 }),
    getInstallations(key, { limit: 0 })
  ]).then(responses => {
    return {
      node: responses[0].data,
      pendingEndorsement: responses[1].data,
      endorsedOrganizations: responses[2].data,
      endorsedDatasets: responses[3].data,
      installations: responses[4].data
    }
  });
};

export const getPendingEndorsement = (key, query) => {
  return axiosInstance.get(`/node/${key}/pendingEndorsement?${qs.stringify(query)}`);
};

export const getEndorsedOrganizations = (key, query) => {
  return axiosInstance.get(`/node/${key}/organization?${qs.stringify(query)}`);
};

export const getEndorsedDatasets = (key, query) => {
  return axiosInstance.get(`/node/${key}/dataset?${qs.stringify(query)}`);
};

export const getInstallations = (key, query) => {
  return axiosInstance.get(`/node/${key}/installation?${qs.stringify(query)}`);
};
