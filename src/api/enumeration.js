import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import config from './util/config';
import { searchConcepts } from './vocabulary';

export const getCountries = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/Country').then(response => response.data);
};

export const getIdTypes = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/IdType').then(response => response.data);
};

export const getContactTypes = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/ContactType').then(response => response.data);
};

export const getLicenses = () => {
  return axiosInstanceWithCredentials.get('/enumeration/license').then(response => response.data);
};

export const getLicenseEnums = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/License').then(response => response.data);
};

export const getInstallationTypes = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/InstallationType').then(response => response.data);
};

export const getLanguages = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/Language').then(response => response.data);
};

export const getVocabularyLanguages = () => {
  return axiosInstanceWithCredentials.get(`${config.dataApi_v1}/vocabularyLanguage`).then(response => response.data);
};

export const getEndpointTypes = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/EndpointType').then(response => response.data);
};

export const getDatasetTypes = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/DatasetType').then(response => response.data);
};

export const getDatasetSubtypes = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/DatasetSubtype').then(response => response.data);
};

export const getMaintenanceUpdateFrequencies = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/MaintenanceUpdateFrequency').then(response => response.data);
};

export const getIdentifierTypes = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/IdentifierType').then(response => response.data);
};

export const getPreservationType = ({latestRelease} = {}) => {
  return searchConcepts('PreservationType', { limit: 1000 }, latestRelease).then(response => response?.data?.results?.map(c => c.name));
  // replace with vocabulary
  //return axiosInstanceWithCredentials.get('/enumeration/basic/PreservationType').then(response => response.data);
};

export const getAccessionStatus = ({latestRelease} = {}) => {
  return searchConcepts('AccessionStatus', { limit: 1000 }, latestRelease).then(response => response?.data?.results?.map(c => c.name));
  // replace with vocabulary
  //return axiosInstanceWithCredentials.get('/enumeration/basic/AccessionStatus').then(response => response.data);
};

export const getCollectionContentType = ({latestRelease} = {}) => {
  return searchConcepts('CollectionContentType', { limit: 1000 }, latestRelease).then(response => response?.data?.results?.map(c => c.name));
  // replace with vocabulary
  // return axiosInstanceWithCredentials.get('/enumeration/basic/CollectionContentType').then(response => response.data);
};

export const getInstitutionType = ({latestRelease} = {}) => {
  return searchConcepts('InstitutionType', { limit: 1000 }, latestRelease).then(response => response?.data?.results?.map(c => c.name));
  // replace with vocabulary
  // return axiosInstanceWithCredentials.get('/enumeration/basic/InstitutionType').then(response => response.data);
};

export const getInstitutionGovernance = ({latestRelease} = {}) => {
  return searchConcepts('InstitutionalGovernance', { limit: 1000 }, latestRelease).then(response => response?.data?.results?.map(c => c.name));
  // replace with vocabulary
  // return axiosInstanceWithCredentials.get('/enumeration/basic/InstitutionGovernance').then(response => response.data);
};

export const getDatasetCategory = ({latestRelease} = {}) => {
  return searchConcepts('DatasetCategory', { limit: 1000 }, latestRelease).then(response => response?.data?.results?.map(c => c.name));
  // replace with vocabulary
  // return axiosInstanceWithCredentials.get('/enumeration/basic/DatasetCategory').then(response => response.data);
};

export const getDiscipline = ({latestRelease} = {}) => {
  return searchConcepts('Discipline', { limit: 1000 }, latestRelease).then(response => response?.data?.results?.map(c => c.name));
  // replace with vocabulary
  // return axiosInstanceWithCredentials.get('/enumeration/basic/Discipline').then(response => response.data);
};

export const getCitesAppendix = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/CitesAppendix').then(response => response.data);
};

export const getStepTypes = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/StepType').then(response => response.data);
};

export const getInstitutionMasterSourceFields = () => {
  return axiosInstanceWithCredentials.get('/grscicoll/institution/sourceableFields').then(response => response.data);
};

export const getCollectionMasterSourceFields = () => {
  return axiosInstanceWithCredentials.get('/grscicoll/collection/sourceableFields').then(response => response.data);
};

export const getSourceTypes = () => {
  return axiosInstanceWithCredentials.get('/enumeration/basic/Source').then(response => response.data);
};