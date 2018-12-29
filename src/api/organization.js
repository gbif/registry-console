import qs from 'qs';
import axios from 'axios';

import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';
import { getNode } from './node';

export const search = query => {
  return axios_cancelable.get(`${config.dataApi}/organization?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getOrgSuggestions = query => {
  return axios_cancelable.get(`${config.dataApi}/organization/suggest?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const deleted = query => {
  return axios_cancelable.get(`${config.dataApi}/organization/deleted?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const pending = query => {
  return axios_cancelable.get(`${config.dataApi}/organization/pending?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const nonPublishing = query => {
  return axios_cancelable.get(`${config.dataApi}/organization/nonPublishing?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getOrganization = key => {
  return axios_cancelable.get(`${config.dataApi}/organization/${key}`, {
    headers: setHeaders()
  });
};

export const getHostedDatasets = ({ key, query }) => {
  return axios_cancelable.get(`${config.dataApi}/organization/${key}/hostedDataset?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getPublishedDatasets = ({ key, query }) => {
  return axios_cancelable.get(`${config.dataApi}/organization/${key}/publishedDataset?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getInstallations = ({ key, query }) => {
  return axios_cancelable.get(`${config.dataApi}/organization/${key}/installation?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const createOrganization = data => {
  return axios.post(`${config.dataApi}/organization`, data, {
    headers: setHeaders()
  });
};

export const updateOrganization = data => {
  return axios.put(`${config.dataApi}/organization/${data.key}`, data, {
    headers: setHeaders()
  });
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
  return axios.delete(`${config.dataApi}/organization/${key}/contact/${contactKey}`, {
    headers: setHeaders()
  });
};

export const updateContact = (key, contactData) => {
  return axios.put(`${config.dataApi}/organization/${key}/contact/${contactData.key}`, contactData, {
    headers: setHeaders()
  });
};

export const createContact = (key, contactData) => {
  return axios.post(`${config.dataApi}/organization/${key}/contact`, contactData, {
    headers: setHeaders()
  });
};

export const deleteEndpoint = (key, endpointKey) => {
  return axios.delete(`${config.dataApi}/organization/${key}/endpoint/${endpointKey}`, {
    headers: setHeaders()
  });
};

export const createEndpoint = (key, endpointData) => {
  return axios.post(`${config.dataApi}/organization/${key}/endpoint`, endpointData, {
    headers: setHeaders()
  });
};

export const deleteIdentifier = (key, identifierKey) => {
  return axios.delete(`${config.dataApi}/organization/${key}/identifier/${identifierKey}`, {
    headers: setHeaders()
  });
};

export const createIdentifier = (key, identifierData) => {
  return axios.post(`${config.dataApi}/organization/${key}/identifier`, identifierData, {
    headers: setHeaders()
  });
};

export const deleteTag = (key, tagKey) => {
  return axios.delete(`${config.dataApi}/organization/${key}/tag/${tagKey}`, {
    headers: setHeaders()
  });
};

export const createTag = (key, tagData) => {
  return axios.post(`${config.dataApi}/organization/${key}/tag`, tagData, {
    headers: setHeaders()
  });
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axios.delete(`${config.dataApi}/organization/${key}/machineTag/${machineTagKey}`, {
    headers: setHeaders()
  });
};

export const createMachineTag = (key, machineTagData) => {
  return axios.post(`${config.dataApi}/organization/${key}/machineTag`, machineTagData, {
    headers: setHeaders()
  });
};

export const deleteComment = (key, commentKey) => {
  return axios.delete(`${config.dataApi}/organization/${key}/comment/${commentKey}`, {
    headers: setHeaders()
  });
};

export const createComment = (key, commentData) => {
  return axios.post(`${config.dataApi}/organization/${key}/comment`, commentData, {
    headers: setHeaders()
  });
};