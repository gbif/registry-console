import qs from 'qs';
import axios from 'axios';

import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';
import { getNode } from './node';

export const search = function (query) {
  return axios_cancelable.get(`${config.dataApi}/organization?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const deleted = function (query) {
  return axios_cancelable.get(`${config.dataApi}/organization/deleted?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const pending = function (query) {
  return axios_cancelable.get(`${config.dataApi}/organization/pending?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const nonPublishing = function (query) {
  return axios_cancelable.get(`${config.dataApi}/organization/nonPublishing?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getOrganization = key => {
  return axios.get(`${config.dataApi}/organization/${key}`, {
    headers: setHeaders()
  });
};

export const getHostedDatasets = ({ key, query }) => {
  return axios.get(`${config.dataApi}/organization/${key}/hostedDataset?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getPublishedDatasets = ({ key, query }) => {
  return axios.get(`${config.dataApi}/organization/${key}/publishedDataset?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getInstallations = ({ key, query }) => {
  return axios.get(`${config.dataApi}/organization/${key}/installation?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const updateOrganization = data => {
  return axios.put(`${config.dataApi}/organization/${data.key}`, data, {
    headers: setHeaders()
  });
};

export const getOrganizationOverview = async key => {
  const organization = (await getOrganization(key)).data;
  const publishedDatasets = (await getPublishedDatasets({ key, query: {} })).data;
  const installations = (await getInstallations({ key, query: {} })).data;
  const hostedDatasets = (await getHostedDatasets({ key, query: {} })).data;
  const endorsingNode = (await getNode(organization.endorsingNodeKey)).data;

  return {
    organization: {
      ...organization,
      endorsingNode
    },
    publishedDatasets,
    installations,
    hostedDatasets
  };
};

export const getOrganizationContacts = key => {
  return axios_cancelable.get(`${config.dataApi}/organization/${key}/contact`, {
    headers: setHeaders()
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

export const getOrganizationEndpoints = key => {
  return axios_cancelable.get(`${config.dataApi}/organization/${key}/endpoint`, {
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

export const getOrganizationIdentifiers = key => {
  return axios_cancelable.get(`${config.dataApi}/organization/${key}/identifier`, {
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

export const getOrganizationTags = key => {
  return axios_cancelable.get(`${config.dataApi}/organization/${key}/tag`, {
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

export const getOrganizationMachineTags = key => {
  return axios_cancelable.get(`${config.dataApi}/organization/${key}/machineTag`, {
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

export const getOrganizationComments = key => {
  return axios_cancelable.get(`${config.dataApi}/organization/${key}/comment`, {
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