import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import axiosWithCrendetials_cancelable from './util/axiosCancelWithCredentials';
import axios_cancelable from './util/axiosCancel';
import { removeEmptyStrings } from './util/util';
import { getInstitution } from './institution';

export const collectionSearch = (query, filter) => {
  const type = filter ? filter.type : '';

  switch (type) {
    case 'deleted':
      return collectionDeleted(query);
    default:
      return axiosWithCrendetials_cancelable.get(`/grscicoll/collection?${qs.stringify(query)}`);
  }
};

export const collectionSuggestionSearch = (query) => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/collection/changeSuggestion?${qs.stringify(query)}`);
}

export const getSuggestion = key => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/collection/changeSuggestion/${key}`);
}

export const discardSuggestion = key => {
  return axiosInstanceWithCredentials.put(`/grscicoll/collection/changeSuggestion/${key}/discard`);
}

export const collectionDeleted = query => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/collection/deleted?${qs.stringify(query)}`);
};

export const getCollection = key => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/collection/${key}`);
};

export const getSuggestedCollections = async query => {
  if (isUUID(query.q)) {
    const collection = (await getCollection(query.q)).data;
    return { data: [collection] };
  }
  return axiosWithCrendetials_cancelable.get(`/grscicoll/collection/suggest?${qs.stringify(query)}`);
};

export const createCollection = data => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection`, removeEmptyStrings(data));
};

export const suggestNewCollection = ({ body, proposerEmail, comments }) => {
  let data = {
    type: 'CREATE',
    suggestedEntity: removeEmptyStrings(body),
    proposerEmail,
    comments
  }
  return axios_cancelable.post(`/grscicoll/collection/changeSuggestion`, data);
}

export const suggestUpdateCollection = ({ body, proposerEmail, comments }) => {
  let data = {
    type: 'UPDATE',
    suggestedEntity: removeEmptyStrings(body),
    proposerEmail,
    comments,
    entityKey: body.key
  }
  return axios_cancelable.post(`/grscicoll/collection/changeSuggestion`, data);
}

export const updateAndApplySuggestion = (key, data) => {
  return axiosInstanceWithCredentials.put(`/grscicoll/collection/changeSuggestion/${key}`, data)
    .then(res => {
      axiosInstanceWithCredentials.put(`/grscicoll/collection/changeSuggestion/${key}/apply`)
    });
}

export const applySuggestion = (key) => {
  return axiosInstanceWithCredentials.put(`/grscicoll/collection/changeSuggestion/${key}/apply`)
}

export const updateCollection = data => {
  return axiosInstanceWithCredentials.put(`/grscicoll/collection/${data.key}`, removeEmptyStrings(data));
};

export const deleteCollection = key => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}`);
};

export const suggestDeleteCollection = ({ entityKey, proposerEmail, comments }) => {
  let data = {
    type: 'DELETE',
    proposerEmail,
    comments,
    entityKey
  }
  return axios_cancelable.post(`/grscicoll/collection/changeSuggestion`, data);
}

export const mergeCollections = ({ collectionKey, mergeIntoCollectionKey }) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${collectionKey}/merge`, {
    replacementEntityKey: mergeIntoCollectionKey
  });
};

export const suggestMergeCollection = ({ entityKey, mergeTargetKey, proposerEmail, comments }) => {
  let data = {
    type: 'MERGE',
    proposerEmail,
    comments,
    mergeTargetKey,
    entityKey
  }
  return axios_cancelable.post(`/grscicoll/collection/changeSuggestion`, data);
}

export const getCollectionOverview = async key => {

  const [{ data: collection }, { data: descriptorGroups }] = await Promise.all([
    getCollection(key),
    getDescriptorGroup(key, { limit: 200 })
  ]);


  const pendingSuggestions = (await collectionSuggestionSearch({ entityKey: key, status: 'PENDING' })).data;
  let institution;
  if (collection.institutionKey) {
    institution = (await getInstitution(collection.institutionKey)).data;
  }

  return {
    ...collection,
    institution,
    descriptorGroups,
    pendingSuggestions
  }
};

export const getDescriptorGroup = (key, query) => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/collection/${key}/descriptorGroup?${qs.stringify(query)}`);
};

export const deleteDescriptorGroup = (key, descriptorGroupKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}/descriptorGroup/${descriptorGroupKey}`);
};

export const updateDescriptorGroup = (key, descriptorGroupData) => {
  const formData = new FormData();
  formData.append('descriptorsFile', descriptorGroupData.selectedFile);
  formData.append('title', descriptorGroupData.title);
  formData.append('description', descriptorGroupData.description);
  formData.append('format', descriptorGroupData.format);

  return axiosInstanceWithCredentials.put(`/grscicoll/collection/${key}/descriptorGroup/${descriptorGroupData.key}`,
    formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
};

export const createDescriptorGroup = (key, descriptorGroupData) => {
  const formData = new FormData();
  formData.append('descriptorsFile', descriptorGroupData.selectedFile);
  formData.append('title', descriptorGroupData.title);
  formData.append('description', descriptorGroupData.description);
  formData.append('format', descriptorGroupData.format);

  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${key}/descriptorGroup`,
    formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
};

export const deleteContact = (key, contactKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}/contactPerson/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstanceWithCredentials.put(`/grscicoll/collection/${key}/contactPerson/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${key}/contactPerson`, contactData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}/comment/${commentKey}`);
};

export const createMasterSource = (key, data) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${key}/masterSourceMetadata`, data);
};

export const createFromMasterSource = (data) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/import`, data);
};

export const deleteMasterSource = (key) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/collection/${key}/masterSourceMetadata`);
};

export const createComment = (key, commentData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/collection/${key}/comment`, commentData);
};