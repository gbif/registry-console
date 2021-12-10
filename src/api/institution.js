import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import axiosWithCrendetials_cancelable from './util/axiosCancelWithCredentials';
import axios_cancelable from './util/axiosCancel';
import { collectionSearch } from './collection';

export const institutionSuggestionSearch = (query, filter) => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/institution/changeSuggestion?${qs.stringify(query)}`);
}

export const institutionSearch = (query, filter) => {
  const type = filter ? filter.type : '';

  switch (type) {
    case 'deleted':
      return institutionDeleted(query);
    default:
      return axiosWithCrendetials_cancelable.get(`/grscicoll/institution?${qs.stringify(query)}`);
  }
};

export const institutionDeleted = query => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/institution/deleted?${qs.stringify(query)}`);
};

export const getInstitution = key => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/institution/${key}`);
};

export const getSuggestedInstitutions = async query => {
  if (isUUID(query.q)) {
    const institution = (await getInstitution(query.q)).data;
    return { data: [institution] };
  }
  return axiosWithCrendetials_cancelable.get(`/grscicoll/institution/suggest?${qs.stringify(query)}`);
};

export const getInstitutionOverview = async key => {
  const [{ data: institution }, { data: collections }, { data: pendingSuggestions }] = await Promise.all([
    getInstitution(key),
    collectionSearch({ institution: key, limit: 0 }),
    institutionSuggestionSearch({entityKey: key, status: 'PENDING'})
  ]);

  return {
    institution,
    collections,
    pendingSuggestions
  };
};

export const suggestNewInstitution = ({body, proposerEmail, comments}) => {
  let data = {
    type: 'CREATE',
    suggestedEntity: body,
    proposerEmail,
    comments
  }
  return axios_cancelable.post(`/grscicoll/institution/changeSuggestion`, data);
}

export const createInstitution = data => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution`, data);
};

export const updateInstitution = data => {
  return axiosInstanceWithCredentials.put(`/grscicoll/institution/${data.key}`, data);
};

export const deleteInstitution = key => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/institution/${key}`);
};

export const mergeInstitutions = ({institutionKey, mergeIntoInstitutionKey}) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution/${institutionKey}/merge`, {
    replacementEntityKey: mergeIntoInstitutionKey
  });
};

export const convertToCollection = ({institutionKey, body}) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution/${institutionKey}/convertToCollection`, body);
};

export const deleteContact = (key, contactKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/institution/${key}/contactPerson/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstanceWithCredentials.put(`/grscicoll/institution/${key}/contactPerson/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution/${key}/contactPerson`, contactData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/institution/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/institution/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/institution/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstanceWithCredentials.delete(`/grscicoll/institution/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstanceWithCredentials.post(`/grscicoll/institution/${key}/comment`, commentData);
};

export const getSuggestion = key => {
  return axiosWithCrendetials_cancelable.get(`/grscicoll/institution/changeSuggestion/${key}`);
}

export const discardSuggestion = key => {
  return axiosInstanceWithCredentials.put(`/grscicoll/institution/changeSuggestion/${key}/discard`);
}

export const applySuggestion = (key) => {
  return axiosInstanceWithCredentials.put(`/grscicoll/institution/changeSuggestion/${key}/apply`)
}

export const suggestDeleteInstitution = ({entityKey, proposerEmail, comments}) => {
  let data = {
    type: 'DELETE',
    proposerEmail,
    comments,
    entityKey
  }
  return axios_cancelable.post(`/grscicoll/institution/changeSuggestion`, data);
}

export const suggestMergeInstitution = ({entityKey, mergeTargetKey, proposerEmail, comments}) => {
  let data = {
    type: 'MERGE',
    proposerEmail,
    comments,
    mergeTargetKey,
    entityKey
  }
  return axios_cancelable.post(`/grscicoll/institution/changeSuggestion`, data);
}

export const suggestConvertInstitution = ({entityKey, nameForNewInstitutionForConvertedCollection, institutionForConvertedCollection, proposerEmail, comments}) => {
  let data = {
    type: 'CONVERSION_TO_COLLECTION',
    proposerEmail,
    comments,
    institutionForConvertedCollection,
    nameForNewInstitutionForConvertedCollection,
    entityKey
  }
  return axios_cancelable.post(`/grscicoll/institution/changeSuggestion`, data);
}

export const updateAndApplySuggestion = (key, data) => {
  return axiosInstanceWithCredentials.put(`/grscicoll/institution/changeSuggestion/${key}`, data)
    .then(res => {
      axiosInstanceWithCredentials.put(`/grscicoll/institution/changeSuggestion/${key}/apply`)
    });
}

export const suggestUpdateInstitution = ({body, proposerEmail, comments}) => {
  let data = {
    type: 'UPDATE',
    suggestedEntity: body,
    proposerEmail,
    comments,
    entityKey: body.key
  }
  return axios_cancelable.post(`/grscicoll/institution/changeSuggestion`, data);
}
