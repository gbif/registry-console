import axios from "axios";
let CancelToken = axios.CancelToken;

function get(url, options) {
  let cancel;
  options = options || {};
  options.cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  let p = axios.get(url, options);
  p.cancel = cancel;
  return p;
}

export default {
  get
};