import qs from 'qs';
import axios from 'axios';

import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';
import { getOrganization } from './organization';

export const search = query => {
  return axios_cancelable.get(`${config.dataApi}/installation?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const deleted = query => {
  return axios_cancelable.get(`${config.dataApi}/installation/deleted?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const nonPublishing = query => {
  return axios_cancelable.get(`${config.dataApi}/installation/nonPublishing?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getInstallation = key => {
  return axios_cancelable.get(`${config.dataApi}/installation/${key}`, {
    headers: setHeaders()
  });
};

export const getServedDatasets = ({ key, query }) => {
  return axios_cancelable.get(`${config.dataApi}/installation/${key}/dataset?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getSyncHistory = ({ key, query }) => {
  return axios_cancelable.get(`${config.dataApi}/installation/${key}/metasync?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const createInstallation = data => {
  return axios.post(`${config.dataApi}/installation`, data, {
    headers: setHeaders()
  })
};

export const updateInstallation = data => {
  return axios.put(`${config.dataApi}/installation/${data.key}`, data, {
    headers: setHeaders()
  })
};

export const getInstallationOverview = async key => {
  const installation = (await getInstallation(key)).data;
  const organization = (await getOrganization(installation.organizationKey)).data;
  const servedDataset = (await getServedDatasets({ key, query: { limit: 0 } })).data;
  const syncHistory = (await getSyncHistory({ key, query: { limit: 0 } })).data;

  return {
    installation: {
      ...installation,
      organization
    },
    servedDataset,
    syncHistory
  };
};

export const deleteContact = (key, contactKey) => {
  return axios.delete(`${config.dataApi}/installation/${key}/contact/${contactKey}`, {
    headers: setHeaders()
  });
};

export const updateContact = (key, contactData) => {
  return axios.put(`${config.dataApi}/installation/${key}/contact/${contactData.key}`, contactData, {
    headers: setHeaders()
  });
};

export const createContact = (key, contactData) => {
  return axios.post(`${config.dataApi}/installation/${key}/contact`, contactData, {
    headers: setHeaders()
  });
};

export const deleteEndpoint = (key, endpointKey) => {
  return axios.delete(`${config.dataApi}/installation/${key}/endpoint/${endpointKey}`, {
    headers: setHeaders()
  });
};

export const createEndpoint = (key, endpointData) => {
  return axios.post(`${config.dataApi}/installation/${key}/endpoint`, endpointData, {
    headers: setHeaders()
  });
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axios.delete(`${config.dataApi}/installation/${key}/machineTag/${machineTagKey}`, {
    headers: setHeaders()
  });
};

export const createMachineTag = (key, machineTagData) => {
  return axios.post(`${config.dataApi}/installation/${key}/machineTag`, machineTagData, {
    headers: setHeaders()
  });
};

export const deleteComment = (key, commentKey) => {
  return axios.delete(`${config.dataApi}/installation/${key}/comment/${commentKey}`, {
    headers: setHeaders()
  });
};

export const createComment = (key, commentData) => {
  return axios.post(`${config.dataApi}/installation/${key}/comment`, commentData, {
    headers: setHeaders()
  });
};

export const syncInstallation = key => {
  return axios.post(`${config.dataApi}/installation/${key}/synchronize`, {
    headers: setHeaders()
  });
};