import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import axiosWithCrendetials_cancelable from './util/axiosCancelWithCredentials';
import { getNode } from './node';

export const search = (query, filter) => {
  const type = filter ? filter.type : '';

  switch (type) {
    case 'deleted':
      return deleted(query);
    case 'pending':
      return pending(query);
    case 'nonPublishing':
      return nonPublishing(query);
    default:
      return axiosWithCrendetials_cancelable.get(`/organization?${qs.stringify(query)}`);
  }
};

export const getOrgSuggestions = async query => {
  if (isUUID(query.q)) {
    const organization = (await getOrganization(query.q)).data;
    return { data: [organization] };
  }
  return axiosWithCrendetials_cancelable.get(`/organization/suggest?${qs.stringify(query)}`);
};

export const deleted = query => {
  return axiosWithCrendetials_cancelable.get(`/organization/deleted?${qs.stringify(query)}`);
};

export const pending = query => {
  return axiosWithCrendetials_cancelable.get(`/organization/pending?${qs.stringify(query)}`);
};

export const nonPublishing = query => {
  return axiosWithCrendetials_cancelable.get(`/organization/nonPublishing?${qs.stringify(query)}`);
};

export const getOrganization = key => {
  return axiosWithCrendetials_cancelable.get(`/organization/${key}`);
};

export const getHostedDatasets = (key, query) => {
  return axiosWithCrendetials_cancelable.get(`/organization/${key}/hostedDataset?${qs.stringify(query)}`);
};

export const getPublishedDatasets = (key, query) => {
  return axiosWithCrendetials_cancelable.get(`/organization/${key}/publishedDataset?${qs.stringify(query)}`);
};

export const getInstallations = (key, query) => {
  return axiosWithCrendetials_cancelable.get(`/organization/${key}/installation?${qs.stringify(query)}`);
};

export const createOrganization = data => {
  return axiosInstanceWithCredentials.post('/organization', data);
};

export const updateOrganization = data => {
  return axiosInstanceWithCredentials.put(`/organization/${data.key}`, data);
};

export const deleteOrganization = key => {
  return axiosInstanceWithCredentials.delete(`/organization/${key}`);
};

export const getOrganizationOverview = async key => {
  const [organization, publishedDataset, installations, hostedDataset] = await Promise.all([
    getOrganization(key),
    getPublishedDatasets(key, { limit: 0 }),
    getInstallations(key, { limit: 0 }),
    getHostedDatasets(key, { limit: 0 })
  ]);
  const endorsingNode = (await getNode(organization.data.endorsingNodeKey)).data;

  return {
    organization: {
      ...organization.data,
      endorsingNode
    },
    publishedDataset: publishedDataset.data,
    installations: installations.data,
    hostedDataset: hostedDataset.data
  };
};

export const deleteContact = (key, contactKey) => {
  return axiosInstanceWithCredentials.delete(`/organization/${key}/contact/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstanceWithCredentials.put(`/organization/${key}/contact/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstanceWithCredentials.post(`/organization/${key}/contact`, contactData);
};

export const deleteEndpoint = (key, endpointKey) => {
  return axiosInstanceWithCredentials.delete(`/organization/${key}/endpoint/${endpointKey}`);
};

export const createEndpoint = (key, endpointData) => {
  return axiosInstanceWithCredentials.post(`/organization/${key}/endpoint`, endpointData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstanceWithCredentials.delete(`/organization/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstanceWithCredentials.post(`/organization/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstanceWithCredentials.delete(`/organization/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstanceWithCredentials.post(`/organization/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstanceWithCredentials.delete(`/organization/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstanceWithCredentials.post(`/organization/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstanceWithCredentials.delete(`/organization/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstanceWithCredentials.post(`/organization/${key}/comment`, commentData);
};

export const retrievePassword = key => {
  return axiosWithCrendetials_cancelable.get(`/organization/${key}/password`);
};