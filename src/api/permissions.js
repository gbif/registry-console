import qs from 'qs';
import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
// import axiosWithCrendetials_cancelable from './util/axiosCancelWithCredentials';

function composeUrl({ resource, key, subType, subKey, query = {} }) {
  query.checkPermissionsOnly = true;
  let str = `/${resource}`;
  if (typeof key !== 'undefined') {
    str += `/${key}`;
    if (typeof subType !== 'undefined') {
      str += `/${subType}`;
      if (typeof subKey !== 'undefined') {
        str += `/${subKey}`;
      }
    }
  }
  str += `?${qs.stringify(query)}`;
  return str;
}

const mayPost = ({ resource, key, subType, subKey, query, body = {}, headers = {} }) => {
  const url = composeUrl({ resource, key, subType, subKey, query });
  return axiosInstanceWithCredentials.post(url, { ...body }, {
    headers: {
      ...headers
    }
  }).then(() => true).catch(err => false);
};

const mayPut = ({ resource, key, subType, subKey, headers = {} }) => {
  const url = composeUrl({ resource, key, subType, subKey });
  return axiosInstanceWithCredentials.put(url, {}, {
    headers: {
      ...headers
    }
  }).then(() => true).catch(err => false);
};

const mayDelete = ({ resource, key, subType, subKey }) => {
  const url = composeUrl({ resource, key, subType, subKey });
  return axiosInstanceWithCredentials.delete(url)
    .then(() => true).catch(err => false);
};

const mayGet = ({ resource, key, subType, subKey }) => {
  const url = composeUrl({ resource, key, subType, subKey });
  return axiosInstanceWithCredentials.get(url)
    .then(() => true).catch(err => false);
};

export const checkPermissions = ({ method, resource, key, subType, subKey, headers }) => {
  if (method === 'post') return mayPost({ resource, key, subType, subKey, headers });
  if (method === 'put') return mayPut({ resource, key, subType, subKey, headers });
  if (method === 'delete') return mayDelete({ resource, key, subType, subKey });
  return mayGet({ resource, key, subType, subKey });
};

export const canCreate = (resource, key, subType, subKey, query, body) => {
  return mayPost({ resource, key, subType, subKey, query, body });
}
export const canUpdate = (resource, key, subType, subKey) => {
  return mayPut({ resource, key, subType, subKey });
}
export const canDelete = (resource, key, subType, subKey) => {
  return mayDelete({ resource, key, subType, subKey });
}
export const canGet = (resource, key, subType, subKey) => {
  return mayGet({ resource, key, subType, subKey });
}

//contacts
export const canCreateContact = (resource, key) => {
  return mayPost({ resource, key, subType: 'contact' });
}
export const canUpdateContact = (resource, key, subKey) => {
  return mayPut({ resource, key, subType: 'contact', subKey });
}
export const canDeleteContact = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'contact', subKey });
}
export const canGetContact = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'contact', subKey });
}

//endpoints
export const canCreateEndpoint = (resource, key) => {
  return mayPost({ resource, key, subType: 'endpoint' });
}
export const canUpdateEndpoint = (resource, key, subKey) => {
  return mayPut({ resource, key, subType: 'endpoint', subKey });
}
export const canDeleteEndpoint = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'endpoint', subKey });
}
export const canGetEndpoint = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'endpoint', subKey });
}

//identifier
export const canCreateIdentifier = (resource, key) => {
  return mayPost({ resource, key, subType: 'identifier' });
}
export const canUpdateIdentifier = (resource, key, subKey) => {
  return mayPut({ resource, key, subType: 'identifier', subKey });
}
export const canDeleteIdentifier = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'identifier', subKey });
}
export const canGetIdentifier = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'identifier', subKey });
}

//tags
export const canCreateTag = (resource, key) => {
  return mayPost({ resource, key, subType: 'tag' });
}
export const canUpdateTag = (resource, key, subKey) => {
  return mayPut({ resource, key, subType: 'tag', subKey });
}
export const canDeleteTag = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'tag', subKey });
}
export const canGetTag = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'tag', subKey });
}

//machineTags
export const canCreateMachineTag = (resource, key) => {
  return mayPost({ resource, key, subType: 'machineTag' });
}
export const canUpdateMachineTag = (resource, key, subKey) => {
  return mayPut({ resource, key, subType: 'machineTag', subKey });
}
export const canDeleteMachineTag = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'machineTag', subKey });
}
export const canGetMachineTag = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'machineTag', subKey });
}

//comments
export const canCreateComment = (resource, key) => {
  return mayPost({ resource, key, subType: 'comment' });
}
export const canUpdateComment = (resource, key, subKey) => {
  return mayPut({ resource, key, subType: 'comment', subKey });
}
export const canDeleteComment = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'comment', subKey });
}
export const canGetComment = (resource, key, subKey) => {
  return mayDelete({ resource, key, subType: 'comment', subKey });
}