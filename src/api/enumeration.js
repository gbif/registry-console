import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';
import { prettifyCountry, prettifyUserType, prettifyLicense } from './util/prettifiers';

export const getCountries = () => {
  return axios_cancelable.get(`${config.dataApi}/enumeration/basic/Country`, {
    headers: setHeaders()
  }).then(response => {
    return response.data.map(code => ({
      code,
      name: prettifyCountry(code)
    }));
  });
};

export const getContactTypes = () => {
  return axios_cancelable.get(`${config.dataApi}/enumeration/basic/ContactType`, {
    headers: setHeaders()
  }).then(response => {
    return response.data.map(code => ({
      code,
      name: prettifyUserType(code)
    }));
  });
};

export const getLicenses = () => {
  return axios_cancelable.get(`${config.dataApi}/enumeration/license`, {
    headers: setHeaders()
  }).then(response => {
    return response.data.map(link => ({
      link,
      name: prettifyLicense(link)
    }));
  });
};

export const getLanguages = () => {
  return axios_cancelable.get(`${config.dataApi}/enumeration/basic/Language`, {
    headers: setHeaders()
  }).then(response => response.data);
};

export const endpointTypes = [
  'EML',
  'FEED',
  'WFS',
  'WMS',
  'TCS_RDF',
  'TCS_XML',
  'DWC_ARCHIVE',
  'DIGIR',
  'DIGIR_MANIS',
  'TAPIR',
  'BIOCASE',
  'BIOCASE_XML_ARCHIVE',
  'OAI_PMH',
  'OTHER'
];

export const identifierTypes = [
  'SOURCE_ID',
  'URL',
  'LSID',
  'HANDLER',
  'DOI',
  'UUID',
  'FTP',
  'URI',
  'UNKNOWN',
  'GBIF_PORTAL',
  'GBIF_NODE',
  'GBIF_PARTICIPANT'
];