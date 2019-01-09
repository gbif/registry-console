import qs from 'qs';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { getNode } from './node';

export const search = query => {
  return axios_cancelable.get(`/organization?${qs.stringify(query)}`);
};

export const getOrgSuggestions = query => {
  return axios_cancelable.get(`/organization/suggest?${qs.stringify(query)}`);
};

export const deleted = query => {
  return axios_cancelable.get(`/organization/deleted?${qs.stringify(query)}`);
};

export const pending = query => {
  return axios_cancelable.get(`/organization/pending?${qs.stringify(query)}`);
};

export const nonPublishing = query => {
  return axios_cancelable.get(`/organization/nonPublishing?${qs.stringify(query)}`);
};

export const getOrganization = key => {
  return axios_cancelable.get(`/organization/${key}`);
};

export const getHostedDatasets = ({ key, query }) => {
  return axios_cancelable.get(`/organization/${key}/hostedDataset?${qs.stringify(query)}`);
};

export const getPublishedDatasets = ({ key, query }) => {
  return axios_cancelable.get(`/organization/${key}/publishedDataset?${qs.stringify(query)}`);
};

export const getInstallations = ({ key, query }) => {
  return axios_cancelable.get(`/organization/${key}/installation?${qs.stringify(query)}`);
};

export const createOrganization = data => {
  return axiosInstance.post(`/organization`, data);
};

export const updateOrganization = data => {
  return axiosInstance.put(`/organization/${data.key}`, data);
};

export const deleteOrganization = key => {
  return axiosInstance.delete(`/organization/${key}`);
};

export const getOrganizationOverview = async key => {
  return Promise.all([
    getOrganization(key),
    getPublishedDatasets({ key, query: { limit: 0 } }),
    getInstallations({ key, query: { limit: 0 } }),
    getHostedDatasets({ key, query: { limit: 0 } })
  ]).then(async responses => {
    const endorsingNode = (await getNode(responses[0].data.endorsingNodeKey)).data;

    return {
      organization: {
        ...responses[0].data,
        endorsingNode
      },
      publishedDataset: responses[1].data,
      installations: responses[2].data,
      hostedDataset: responses[3].data
    };
  });
};

export const deleteContact = (key, contactKey) => {
  return axiosInstance.delete(`/organization/${key}/contact/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstance.put(`/organization/${key}/contact/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstance.post(`/organization/${key}/contact`, contactData);
};

export const deleteEndpoint = (key, endpointKey) => {
  return axiosInstance.delete(`/organization/${key}/endpoint/${endpointKey}`);
};

export const createEndpoint = (key, endpointData) => {
  return axiosInstance.post(`/organization/${key}/endpoint`, endpointData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstance.delete(`/organization/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstance.post(`/organization/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstance.delete(`/organization/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstance.post(`/organization/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstance.delete(`/organization/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstance.post(`/organization/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstance.delete(`/organization/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstance.post(`/organization/${key}/comment`, commentData);
};