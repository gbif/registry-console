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

export const updateInstallation = data => {
  return axios.put(`${config.dataApi}/installation/${data.key}`, data, {
    headers: setHeaders()
  })
};

export const getInstallationIdentifiers = key => {
    return axios_cancelable.get(`${config.dataApi}/installation/${key}/identifier`, {
      headers: setHeaders()
    });
};

export const getInstallationOverview = async key => {
  const installation = (await getInstallation(key)).data;
  const organization = (await getOrganization(installation.organizationKey)).data;
  const identifiers = (await getInstallationIdentifiers(key)).data;

  return {
    installation: {
      ...installation,
      organization,
      identifiers
    }
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

export const deleteIdentifier = (key, identifierKey) => {
  return axios.delete(`${config.dataApi}/installation/${key}/identifier/${identifierKey}`, {
    headers: setHeaders()
  });
};

export const createIdentifier = (key, identifierData) => {
  return axios.post(`${config.dataApi}/installation/${key}/identifier`, identifierData, {
    headers: setHeaders()
  });
};

export const deleteTag = (key, tagKey) => {
  return axios.delete(`${config.dataApi}/installation/${key}/tag/${tagKey}`, {
    headers: setHeaders()
  });
};

export const createTag = (key, tagData) => {
  return axios.post(`${config.dataApi}/installation/${key}/tag`, tagData, {
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