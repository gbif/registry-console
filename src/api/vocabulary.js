import qs from "qs";

import axiosInstance from "./util/axiosInstance";
import axios_cancelable from "./util/axiosCancel";

export const searchVocabularies = query => {
  return axios_cancelable.get(`/vocabularies?${qs.stringify(query)}`);
};

export const getVocabulary = key => {
  return axios_cancelable.get(`/vocabularies/${key}`);
};

export const createVocabulary = data => {
  return axiosInstance.post("/vocabularies", data);
};

export const updateVocabulary = data => {
  return axiosInstance.put(`/vocabularies/${data.name}`, data);
};

export const deprecateVocabulary = key => {
  return axiosInstance.put(`/vocabularies/${key}/deprecate`);
};

export const restoreVocabulary = key => {
  return axiosInstance.delete(`/vocabularies/${key}/deprecate`);
};

export const suggestVocabulary = query => {
  return axios_cancelable.get(`/vocabularies/suggest?${qs.stringify(query)}`);
};

export const searchConcepts = (vocabularyName, query) => {
  return axios_cancelable.get(
    `/vocabularies/${vocabularyName}/concepts?${qs.stringify(query)}`
  );
};

export const getConcept = (vocabularyName, name) => {
  return axios_cancelable.get(
    `/vocabularies/${vocabularyName}/concepts/${name}`
  );
};

export const createConcept = (vocabularyName, data) => {
  return axiosInstance.post(`/vocabularies/${vocabularyName}/concepts`, data);
};

export const updateConcept = (vocabularyName, data) => {
  return axiosInstance.put(
    `/vocabularies/${vocabularyName}/concepts/${data.name}`,
    data
  );
};

export const deprecateConcept = (vocabularyName, data) => {
  return axiosInstance.put(
    `/vocabularies/${vocabularyName}/concepts/${data.name}/deprecate`
  );
};

export const restoreConcept = (vocabularyName, data) => {
  return axiosInstance.delete(
    `/vocabularies/${vocabularyName}/concepts/${data.name}/deprecate`
  );
};

export const suggestConcept = (vocabularyName, query) => {
    return axios_cancelable.get(
      `/vocabularies/${vocabularyName}/concepts/suggest?${qs.stringify(query)}`
    );
  };