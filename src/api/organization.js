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

export const getHostedDatasets = (key, query) => {
  return axios.get(`${config.dataApi}/organization/${key}/hostedDataset${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getPublishedDatasets = (key, query) => {
  return axios.get(`${config.dataApi}/organization/${key}/publishedDataset${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getInstallations = (key, query) => {
  return axios.get(`${config.dataApi}/organization/${key}/installation${qs.stringify(query)}`, {
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
  const publishedDatasets = (await getPublishedDatasets(key, {})).data;
  const installations = (await getInstallations(key, {})).data;
  const hostedDatasets = (await getHostedDatasets(key, {})).data;
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