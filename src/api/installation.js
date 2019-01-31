import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { getOrganization } from './organization';

export const search = query => {
  return axios_cancelable.get(`/installation?${qs.stringify(query)}`);
};

export const deleted = query => {
  return axios_cancelable.get(`/installation/deleted?${qs.stringify(query)}`);
};

export const nonPublishing = query => {
  return axios_cancelable.get(`/installation/nonPublishing?${qs.stringify(query)}`);
};

export const getInstallation = key => {
  return axios_cancelable.get(`/installation/${key}`);
};

export const getSuggestedInstallations = async query => {
  if (isUUID(query.q)) {
    const installation = (await getInstallation(query.q)).data;
    return { data: [installation] };
  }
  return axios_cancelable.get(`/installation/suggest?${qs.stringify(query)}`);
};

export const getServedDatasets = (key, query) => {
  return axios_cancelable.get(`/installation/${key}/dataset?${qs.stringify(query)}`);
};

export const getSyncHistory = (key, query) => {
  return axios_cancelable.get(`/installation/${key}/metasync?${qs.stringify(query)}`);
};

export const createInstallation = data => {
  return axiosInstance.post(`/installation`, data);
};

export const updateInstallation = data => {
  return axiosInstance.put(`/installation/${data.key}`, data);
};

export const deleteInstallation = key => {
  return axiosInstance.delete(`/installation/${key}`);
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
  return axiosInstance.delete(`/installation/${key}/contact/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstance.put(`/installation/${key}/contact/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstance.post(`/installation/${key}/contact`, contactData);
};

export const deleteEndpoint = (key, endpointKey) => {
  return axiosInstance.delete(`/installation/${key}/endpoint/${endpointKey}`);
};

export const createEndpoint = (key, endpointData) => {
  return axiosInstance.post(`/installation/${key}/endpoint`, endpointData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstance.delete(`/installation/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstance.post(`/installation/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstance.delete(`/installation/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstance.post(`/installation/${key}/comment`, commentData);
};

export const syncInstallation = key => {
  return axiosInstance.post(`/installation/${key}/synchronize`);
};

export const getSyncState = async iptBaseURL => {
  // TODO return real request
  const syncState = {"registeredResources":[{"dwca":"http://maerua.iict.pt/ipt/archive.do?r=iict_cz","eml":"http://maerua.iict.pt/ipt/eml.do?r=iict_cz","gbifKey":"c690c2b5-8002-4d12-831c-9258dd618f78","lastPublished":"2017-04-19","records":9244,"recordsByExtension":{"http://rs.tdwg.org/dwc/terms/Occurrence":9244},"title":"IICT Colecção Zoológica","type":"OCCURRENCE","version":4.2},{"dwca":"http://maerua.iict.pt/ipt/archive.do?r=agomammals","eml":"http://maerua.iict.pt/ipt/eml.do?r=agomammals","gbifKey":"2fea4042-5aba-4cda-bab9-adcfa2bbe97d","lastPublished":"2018-04-24","records":9879,"recordsByExtension":{"http://rs.tdwg.org/dwc/terms/Occurrence":9879},"title":"Bibliographic records of Angola mammals","type":"OCCURRENCE","version":2.2},{"dwca":"http://maerua.iict.pt/ipt/archive.do?r=lisc","eml":"http://maerua.iict.pt/ipt/eml.do?r=lisc","gbifKey":"231c5bcf-1b56-4905-a398-6d0e18f6de1a","lastPublished":"2017-10-13","records":68791,"recordsByExtension":{"http://rs.tdwg.org/dwc/terms/Occurrence":68791},"title":"IICT Herbário LISC","type":"OCCURRENCE","version":4.2}]};
  // const syncState = axios_cancelable.get(`/installation/ipt/inventory/dataset?iptBaseURL=${iptBaseURL}`).data;
  // return new Promise((resolve, reject) => {
  //   resolve({"registeredResources":[{"dwca":"http://maerua.iict.pt/ipt/archive.do?r=iict_cz","eml":"http://maerua.iict.pt/ipt/eml.do?r=iict_cz","gbifKey":"c690c2b5-8002-4d12-831c-9258dd618f78","lastPublished":"2017-04-19","records":9244,"recordsByExtension":{"http://rs.tdwg.org/dwc/terms/Occurrence":9244},"title":"IICT Colecção Zoológica","type":"OCCURRENCE","version":4.2},{"dwca":"http://maerua.iict.pt/ipt/archive.do?r=agomammals","eml":"http://maerua.iict.pt/ipt/eml.do?r=agomammals","gbifKey":"2fea4042-5aba-4cda-bab9-adcfa2bbe97d","lastPublished":"2018-04-24","records":9879,"recordsByExtension":{"http://rs.tdwg.org/dwc/terms/Occurrence":9879},"title":"Bibliographic records of Angola mammals","type":"OCCURRENCE","version":2.2},{"dwca":"http://maerua.iict.pt/ipt/archive.do?r=lisc","eml":"http://maerua.iict.pt/ipt/eml.do?r=lisc","gbifKey":"231c5bcf-1b56-4905-a398-6d0e18f6de1a","lastPublished":"2017-10-13","records":68791,"recordsByExtension":{"http://rs.tdwg.org/dwc/terms/Occurrence":68791},"title":"IICT Herbário LISC","type":"OCCURRENCE","version":4.2}]})
  // });
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
  // TODO return real request
  // return axios_cancelable.get(`/occurrence/count?datasetKey=${key}`);
  return new Promise(resolve => resolve({ data: 9244 }));
};