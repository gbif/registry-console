import qs from 'qs';
import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';

export const search = query => {
  return axios_cancelable.get(`/admin/user/search?${qs.stringify(query)}`);
};

export const getUser = userName => {
  return axios_cancelable.get(`/admin/user/${userName}`);
};

export const updateUser = data => {
  return axiosInstance.put(`/admin/user/${data.userName}`, data);
};

export const getRoles = () => {
  return axios_cancelable.get(`/admin/user/roles`);
};

export const getDownloads = async (userName, query) => {
  return axios_cancelable.get(`/occurrence/download/user/${userName}?${qs.stringify(query)}`);
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
  return axios_cancelable.get(`/admin/user/${userName}/editorRight`);
};

export const addEditorRight = async (userName, key) => {
  return axiosInstance.post(`/admin/user/${userName}/editorRight`, key, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
};

export const deleteEditorRight = async (userName, key) => {
  return axiosInstance.delete(`/admin/user/${userName}/editorRight/${key}`);
};