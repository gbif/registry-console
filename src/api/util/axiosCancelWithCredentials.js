import axios from 'axios';
import axiosInstanceWithCredentials from './axiosInstanceWithCredentials';

let CancelToken = axios.CancelToken;

function get(url, options) {
  let cancel;
  options = options || {};
  options.cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  let p = axiosInstanceWithCredentials.get(url, options);
  p.cancel = cancel;
  return p;
}

const axiosCancelWithCredentials = { get };
export default axiosCancelWithCredentials;