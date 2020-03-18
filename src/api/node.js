import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';

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

export const deleteEndpoint = (key, endpointKey) => {
  return axiosInstance.delete(`/node/${key}/endpoint/${endpointKey}`);
};

export const createEndpoint = (key, endpointData) => {
  return axiosInstance.post(`/node/${key}/endpoint`, endpointData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstance.delete(`/node/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstance.post(`/node/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstance.delete(`/node/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstance.post(`/node/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstance.delete(`/node/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstance.post(`/node/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstance.delete(`/node/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstance.post(`/node/${key}/comment`, commentData);
};
