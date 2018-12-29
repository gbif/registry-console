import qs from 'qs';
import axios from 'axios';

import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';

export const search = query => {
  return axios_cancelable.get(`${config.dataApi}/node?${qs.stringify(query)}`, {
    headers: setHeaders()
  });
};

export const getNodeSuggestions = query => {
  return axios_cancelable.get(`${config.dataApi}/node/suggest?q=${query}`, {
    headers: setHeaders()
  });
};

export const getNode = key => {
  return axios.get(`${config.dataApi}/node/${key}`, {
    headers: setHeaders()
  });
};

export const getNodeOverview = async key => {
  return Promise.all([
    getNode(key),
    getPendingEndorsement({ key, query: { limit: 0 } }),
    getEndorsedOrganizations({ key, query: { limit: 0 } }),
    getEndorsedDatasets({ key, query: { limit: 0 } }),
    getInstallations({ key, query: { limit: 0 } })
  ]).then(responses => {
    return {
      node: responses[0].data,
      pendingEndorsement: responses[1].data,
      endorsedOrganizations: responses[2].data,
      endorsedDatasets: responses[3].data,
      installations: responses[4].data
    }
  });
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
