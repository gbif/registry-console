import qs from 'qs';
import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';

export const search = query => {
  return axios_cancelable.get(`/admin/user/search?${qs.stringify(query)}`);
};

export const getUser = key => {
  return axios_cancelable.get(`/admin/user/${key}`);
};

export const updateUser = data => {
  return axiosInstance.put(`/admin/user/${data.key}`, data);
};

export const getRoles = () => {
  return axios_cancelable.get(`/admin/user/roles`);
};

export const getDownloads = async (key, query) => {
  return axios_cancelable.get(`/occurrence/download/user/${key}?${qs.stringify(query)}`);
};

export const getUserOverview = async key => {
  const user = (await getUser(key)).data;
  const downloads = (await getDownloads(key, { limit: 0 })).data;
  return {
    user,
    downloads
  };
};
