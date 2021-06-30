import qs from 'qs';
import axiosInstanceWithCredentials from './util/axiosInstanceWithCredentials';
import axiosWithCrendetials_cancelable from './util/axiosCancelWithCredentials';

export const search = query => {
  return axiosWithCrendetials_cancelable.get(`/admin/user/search?${qs.stringify(query)}`);
};

export const getUser = userName => {
  return axiosWithCrendetials_cancelable.get(`/admin/user/${userName}`);
};

export const whoami = async () => {
  const user = await axiosInstanceWithCredentials.post(`/user/whoami`, {});
  const downloads = await getDownloads(user.data.userName);
  return {
    user: user.data,
    downloads: downloads.data
  };
};

export const updateUser = data => {
  return axiosInstanceWithCredentials.put(`/admin/user/${data.userName}`, data);
};

export const getRoles = () => {
  return axiosWithCrendetials_cancelable.get(`/admin/user/roles`);
};

export const getDownloads = async (userName, query) => {
  return axiosWithCrendetials_cancelable.get(`/occurrence/download/user/${userName}?${qs.stringify(query)}`);
};

export const getUserOverview = async userName => {
  const [{ data: user }, { data: editorRights }, { data: downloads }] = await Promise.all([
    getUser(userName),
    getEditorRight(userName),
    getDownloads(userName, { limit: 0 })
  ]);

  user.editorRoleScopes = editorRights;

  return {
    user,
    downloads
  };
};

export const getEditorRight = async userName => {
  return axiosWithCrendetials_cancelable.get(`/admin/user/${userName}/editorRight`);
};

export const addEditorRight = async (userName, key) => {
  return axiosInstanceWithCredentials.post(`/admin/user/${userName}/editorRight`, key, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

export const deleteEditorRight = async (userName, key) => {
  return axiosInstanceWithCredentials.delete(`/admin/user/${userName}/editorRight/${key}`);
};

export const hasEndorsementRight = async (userName, organizationKey) => {
  return axiosWithCrendetials_cancelable.get(`/organization/${organizationKey}/endorsement/user/${userName}`);
};

export const deleteUser = async (userName) => {
  return axiosInstanceWithCredentials.delete(`/admin/user/${userName}`);
};

