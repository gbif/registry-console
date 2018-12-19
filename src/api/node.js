import qs from 'qs';
import axios from 'axios';

import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';

export const search = function (query) {
  return axios_cancelable.get(`${config.dataApi}/node?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getNode = key => {
  return axios.get(`${config.dataApi}/node/${key}`, {
    headers: setHeaders()
  });
};

export const getNodeOverview = async key => {
  const node = (await getNode(key)).data;
  const pendingEndorsement = (await getPendingEndorsement({ key, query: { limit: 0 } })).data;
  const endorsedOrganizations = (await getEndorsedOrganizations({ key, query: { limit: 0 } })).data;
  const endorsedDatasets = (await getEndorsedDatasets({ key, query: { limit: 0 } })).data;
  const installations = (await getInstallations({ key, query: { limit: 0 } })).data;

  return {
    node,
    pendingEndorsement,
    endorsedOrganizations,
    endorsedDatasets,
    installations
  }
};

export const getPendingEndorsement = ({ key, query }) => {
  return axios.get(`${config.dataApi}/node/${key}/pendingEndorsement?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getEndorsedOrganizations = ({ key, query }) => {
  return axios.get(`${config.dataApi}/node/${key}/organization?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getEndorsedDatasets = ({ key, query }) => {
  return axios.get(`${config.dataApi}/node/${key}/dataset?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getInstallations = ({ key, query }) => {
  return axios.get(`${config.dataApi}/node/${key}/installation?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};
