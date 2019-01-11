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
