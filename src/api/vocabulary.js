import qs from "qs";
import config from './util/config';
import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import axiosWithCrendetials_cancelable from './util/axiosCancelWithCredentials';

export const searchVocabularies = query => {
  return axiosWithCrendetials_cancelable.get(`${config.dataApi_v1}/vocabularies?${qs.stringify(query)}`, { baseURI: 'swappyswap.com' });
};

export const getVocabulary = key => {
  return axiosWithCrendetials_cancelable.get(`${config.dataApi_v1}/vocabularies/${key}`);
};

export const createVocabulary = data => {
  return axiosInstanceWithCredentials.post(`${config.dataApi_v1}/vocabularies`, data);
};

export const updateVocabulary = data => {
  return axiosInstanceWithCredentials.put(`${config.dataApi_v1}/vocabularies/${data.name}`, data);
};

export const deprecateVocabulary = key => {
  return axiosInstanceWithCredentials.put(`${config.dataApi_v1}/vocabularies/${key}/deprecate`);
};

export const restoreVocabulary = key => {
  return axiosInstanceWithCredentials.delete(`${config.dataApi_v1}/vocabularies/${key}/deprecate`);
};

export const suggestVocabulary = query => {
  return axiosWithCrendetials_cancelable.get(`${config.dataApi_v1}/vocabularies/suggest?${qs.stringify(query)}`);
};

export const searchConcepts = (vocabularyName, query) => {
  return axiosWithCrendetials_cancelable.get(
    `${config.dataApi_v1}/vocabularies/${vocabularyName}/concepts?${qs.stringify(query)}`
  );
};

const getChildrenRecursive = async (vocabularyName, parent) => {

    if(Number(parent.childrenCount) === 0) {
      return parent;
    } else {
      let children = await axiosWithCrendetials_cancelable.get(
        `${config.dataApi_v1}/vocabularies/${vocabularyName}/concepts?parentKey=${parent.key}&includeChildrenCount=true`
      );
      await Promise.all(children.data.results.map(c => getChildrenRecursive(vocabularyName, c)))
      parent.children =  children.data.results;
      return parent;
    }
    
}

export const getConceptsTree = async (vocabularyName, query) => {
  
  let rootConcepts = await axiosWithCrendetials_cancelable.get(
    `${config.dataApi_v1}/vocabularies/${vocabularyName}/concepts?${query.parentKey ? '':'hasParent=false'}&includeChildrenCount=true&${qs.stringify(query)}`
  );
  const unNested = await axiosWithCrendetials_cancelable.get(
    `${config.dataApi_v1}/vocabularies/${vocabularyName}/concepts?${qs.stringify(query)}`
  );
  rootConcepts.data._unNestedCount = unNested.data.count;
  rootConcepts.data._keys = unNested.data.results.map(r => r.key)
  await Promise.all(rootConcepts.data.results.map(c => getChildrenRecursive(vocabularyName, c)))
  return rootConcepts;

};

export const getConcept = (vocabularyName, name) => {
  return axiosWithCrendetials_cancelable.get(
    `${config.dataApi_v1}/vocabularies/${vocabularyName}/concepts/${name}?includeParents=true`
  );
};

export const createConcept = (vocabularyName, data) => {
  return axiosInstanceWithCredentials.post(`${config.dataApi_v1}/vocabularies/${vocabularyName}/concepts`, data);
};

export const updateConcept = (vocabularyName, data) => {
  return axiosInstanceWithCredentials.put(
    `${config.dataApi_v1}/vocabularies/${vocabularyName}/concepts/${data.name}`,
    data
  );
};

export const deprecateConcept = (vocabularyName, data) => {
  return axiosInstanceWithCredentials.put(
    `${config.dataApi_v1}/vocabularies/${vocabularyName}/concepts/${data.name}/deprecate`
  );
};

export const restoreConcept = (vocabularyName, data) => {
  return axiosInstanceWithCredentials.delete(
    `${config.dataApi_v1}/vocabularies/${vocabularyName}/concepts/${data.name}/deprecate`
  );
};

export const suggestConcept = (vocabularyName, query) => {
    return axiosWithCrendetials_cancelable.get(
      `${config.dataApi_v1}/vocabularies/${vocabularyName}/concepts/suggest?${qs.stringify(query)}`
    );
  };