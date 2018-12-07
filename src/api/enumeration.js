import config from './util/config';
import axios_cancelable from './util/axiosCancel';
import setHeaders from './util/setHeaders';
import { prettifyCountry, prettifyUserType } from './util/prettifiers';

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