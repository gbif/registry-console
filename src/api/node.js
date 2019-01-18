import qs from 'qs';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { isUUID } from '../components/helpers';

export const search = query => {
  return axios_cancelable.get(`/node?${qs.stringify(query)}`);
};

export const getNode = key => {
  return axiosInstance.get(`/node/${key}`);
};

export const getNodeSuggestions = async query => {
  if (isUUID(query.q)) {
    const node = (await getNode(query.q)).data;
    return { data: [node] };
  }
  return axios_cancelable.get(`/node/suggest?${qs.stringify(query)}`);
};

export const getNodeOverview = async key => {
  const [node, pendingEndorsement, endorsedOrganizations, endorsedDatasets, installations] = await Promise.all([
    getNode(key),
    getPendingEndorsement(key, { limit: 0 }),
    getEndorsedOrganizations(key, { limit: 0 }),
    getEndorsedDatasets(key, { limit: 0 }),
    getInstallations(key, { limit: 0 })
  ]);

  return {
    node: node.data,
    pendingEndorsement: pendingEndorsement.data,
    endorsedOrganizations: endorsedOrganizations.data,
    endorsedDatasets: endorsedDatasets.data,
    installations: installations.data
  };
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
