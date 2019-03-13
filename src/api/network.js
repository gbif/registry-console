import qs from 'qs';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';

export const searchNetwork = query => {
  return axios_cancelable.get(`/network?${qs.stringify(query)}`);
};

export const getNetwork = key => {
  return axios_cancelable.get(`/network/${key}`);
};

export const createNetwork = data => {
  return axiosInstance.post('/network', data);
};

export const updateNetwork = data => {
  return axiosInstance.put(`/network/${data.key}`, data);
};

export const deleteNetwork = key => {
  return axiosInstance.delete(`/network/${key}`);
};

export const deleteContact = (key, contactKey) => {
  return axiosInstance.delete(`/network/${key}/contact/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstance.put(`/network/${key}/contact/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstance.post(`/network/${key}/contact`, contactData);
};

export const deleteEndpoint = (key, endpointKey) => {
  return axiosInstance.delete(`/network/${key}/endpoint/${endpointKey}`);
};

export const createEndpoint = (key, endpointData) => {
  return axiosInstance.post(`/network/${key}/endpoint`, endpointData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstance.delete(`/network/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstance.post(`/network/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstance.delete(`/network/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstance.post(`/network/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstance.delete(`/network/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstance.post(`/network/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstance.delete(`/network/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstance.post(`/network/${key}/comment`, commentData);
};

export const getConstituentDataset = (key, query) => {
  return axios_cancelable.get(`/network/${key}/constituents?${qs.stringify(query)}`);
};