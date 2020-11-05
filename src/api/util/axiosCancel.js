import axios from 'axios';
import config from './config';

let CancelToken = axios.CancelToken;

const instance = axios.create({
  baseURL: config.dataApi
});

function get(url, options) {
  let cancel;
  options = options || {};
  options.cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  let p = instance.get(url, options);
  p.cancel = cancel;
  return p;
}

export default {
  get
};