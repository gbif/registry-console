import qs from "qs";
import config from './util/config';
import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import axiosWithCrendetials_cancelable from './util/axiosCancelWithCredentials';

export const searchVocabularyTags = query => {
  return axiosWithCrendetials_cancelable.get(`${config.dataApi_v1}/vocabularyTags?${qs.stringify(query)}`);
};

export const getVocabularyTag = key => {
  return axiosWithCrendetials_cancelable.get(`${config.dataApi_v1}/vocabularyTags/${key}`);
};

export const createVocabularyTag = data => {
  return axiosInstanceWithCredentials.post(`${config.dataApi_v1}/vocabularyTags`, data);
};

export const updateVocabularyTag = data => {
  return axiosInstanceWithCredentials.put(`${config.dataApi_v1}/vocabularyTags/${data.name}`, data);
};

export const deleteVocabularyTag = data => {
    return axiosInstanceWithCredentials.delete(`${config.dataApi_v1}/vocabularyTags/${data.name}`);
  };