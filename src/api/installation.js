import axios from 'axios';
import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import axiosWithCrendetials_cancelable from './util/axiosCancelWithCredentials';
import { getOrganization } from './organization';
import config from './util/config';

export const search = (query, filter) => {
  const type = filter ? filter.type : '';

  switch (type) {
    case 'deleted':
      return deleted(query);
    case 'servingNoDatasets':
      return nonPublishing(query);
    default:
      return axiosWithCrendetials_cancelable.get(`/installation?${qs.stringify(query)}`);
  }
};

export const deleted = query => {
  return axiosWithCrendetials_cancelable.get(`/installation/deleted?${qs.stringify(query)}`);
};

export const nonPublishing = query => {
  return axiosWithCrendetials_cancelable.get(`/installation/nonPublishing?${qs.stringify(query)}`);
};

export const getInstallation = key => {
  return axiosWithCrendetials_cancelable.get(`/installation/${key}`);
};

export const getSuggestedInstallations = async query => {
  if (isUUID(query.q)) {
    const installation = (await getInstallation(query.q)).data;
    return { data: [installation] };
  }
  return axiosWithCrendetials_cancelable.get(`/installation/suggest?${qs.stringify(query)}`);
};

export const getServedDatasets = (key, query) => {
  return axiosWithCrendetials_cancelable.get(`/installation/${key}/dataset?${qs.stringify(query)}`);
};

export const getSyncHistory = (key, query) => {
  return axiosWithCrendetials_cancelable.get(`/installation/${key}/metasync?${qs.stringify(query)}`);
};

export const createInstallation = data => {
  return axiosInstanceWithCredentials.post(`/installation`, data);
};

export const updateInstallation = data => {
  return axiosInstanceWithCredentials.put(`/installation/${data.key}`, data);
};

export const deleteInstallation = key => {
  return axiosInstanceWithCredentials.delete(`/installation/${key}`);
};

export const getInstallationOverview = async key => {
  const [{ data: installation }, { data: servedDataset }, { data: syncHistory }] = await Promise.all([
    getInstallation(key),
    getServedDatasets(key, { limit: 0 }),
    getSyncHistory(key, { limit: 0 })
  ]);
  const organization = (await getOrganization(installation.organizationKey)).data;

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
  return axiosInstanceWithCredentials.delete(`/installation/${key}/contact/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstanceWithCredentials.put(`/installation/${key}/contact/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstanceWithCredentials.post(`/installation/${key}/contact`, contactData);
};

export const deleteEndpoint = (key, endpointKey) => {
  return axiosInstanceWithCredentials.delete(`/installation/${key}/endpoint/${endpointKey}`);
};

export const createEndpoint = (key, endpointData) => {
  return axiosInstanceWithCredentials.post(`/installation/${key}/endpoint`, endpointData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstanceWithCredentials.delete(`/installation/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstanceWithCredentials.post(`/installation/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstanceWithCredentials.delete(`/installation/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstanceWithCredentials.post(`/installation/${key}/comment`, commentData);
};

export const syncInstallation = key => {
  return axiosInstanceWithCredentials.post(`/installation/${key}/synchronize`);
};

export const getSyncState = async iptBaseURL => {
  const syncState = axios.get(`${config.gbifUrl}/api/installation/ipt/inventory/dataset?iptBaseURL=${iptBaseURL}`).data;
  const countRequests = [];
  syncState.registeredResources.forEach(resource => {
    countRequests.push(getDatasetCount(resource.gbifKey));
  });
  const countResponses = await Promise.all(countRequests);
  for (let i = 0; i < syncState.registeredResources.length; i++) {
    syncState.registeredResources[i]._gbifCount = countResponses[i].data;
  }

  return syncState;
};

export const getDatasetCount = key => {
  return axiosWithCrendetials_cancelable.get(`/occurrence/count?datasetKey=${key}`);
};