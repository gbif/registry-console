import qs from 'qs';

import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import axiosWithCrendetials_cancelable from './util/axiosInstanceWithCredentials';
import {isUUID} from "validator";

export const getNetworkSuggestions = async query => {
  if (isUUID(query.q)) {
    const network = (await getNetwork(query.q)).data;
    return { data: [network] };
  }
  return axiosWithCrendetials_cancelable.get(`/network/suggest?${qs.stringify(query)}`);
};

export const searchNetwork = query => {
  return axiosWithCrendetials_cancelable.get(`/network?${qs.stringify(query)}`);
};

export const getNetwork = key => {
  return axiosWithCrendetials_cancelable.get(`/network/${key}`);
};

export const createNetwork = data => {
  return axiosInstanceWithCredentials.post('/network', data);
};

export const updateNetwork = data => {
  return axiosInstanceWithCredentials.put(`/network/${data.key}`, data);
};

export const deleteNetwork = key => {
  return axiosInstanceWithCredentials.delete(`/network/${key}`);
};

export const deleteContact = (key, contactKey) => {
  return axiosInstanceWithCredentials.delete(`/network/${key}/contact/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstanceWithCredentials.put(`/network/${key}/contact/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstanceWithCredentials.post(`/network/${key}/contact`, contactData);
};

export const deleteEndpoint = (key, endpointKey) => {
  return axiosInstanceWithCredentials.delete(`/network/${key}/endpoint/${endpointKey}`);
};

export const createEndpoint = (key, endpointData) => {
  return axiosInstanceWithCredentials.post(`/network/${key}/endpoint`, endpointData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstanceWithCredentials.delete(`/network/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstanceWithCredentials.post(`/network/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstanceWithCredentials.delete(`/network/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstanceWithCredentials.post(`/network/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstanceWithCredentials.delete(`/network/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstanceWithCredentials.post(`/network/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstanceWithCredentials.delete(`/network/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstanceWithCredentials.post(`/network/${key}/comment`, commentData);
};

export const getConstituentDataset = (key, query) => {
  return axiosWithCrendetials_cancelable.get(`/network/${key}/constituents?${qs.stringify(query)}`);
};

export const addConstituentDataset = (networkKey, dataset) => {
  return axiosInstanceWithCredentials.post(`/network/${networkKey}/constituents/${dataset.key}`, dataset);
};

export const deleteConstituentDataset = (networkKey, datasetKey) => {
  return axiosInstanceWithCredentials.delete(`/network/${networkKey}/constituents/${datasetKey}`);
};
