import qs from 'qs';
import { isUUID } from 'validator';

import axiosInstance from './util/axiosInstance';
import axios_cancelable from './util/axiosCancel';
import { getOrganization } from './organization';
import { getInstallation } from './installation';

export const searchDatasets = query => {
  return axios_cancelable.get(`/dataset?${qs.stringify(query)}`);
};

export const getDatasetSuggestions = async query => {
  if (isUUID(query.q)) {
    const dataset = (await getDataset(query.q)).data;
    return { data: [dataset] };
  }
  return axios_cancelable.get(`/dataset/suggest?${qs.stringify(query)}`);
};

export const searchDeletedDatasets = query => {
  return axios_cancelable.get(`/dataset/deleted?${qs.stringify(query)}`);
};

export const searchDuplicateDatasets = query => {
  return axios_cancelable.get(`/dataset/duplicate?${qs.stringify(query)}`);
};

export const searchConstituentDatasets = query => {
  return axios_cancelable.get(`/dataset/constituents?${qs.stringify(query)}`);
};

export const searchDatasetsWithNoEndpoint = query => {
  return axios_cancelable.get(`/dataset/withNoEndpoint?${qs.stringify(query)}`);
};

export const createDataset = data => {
  return axiosInstance.post('/dataset', data);
};

export const updateDataset = data => {
  return axiosInstance.put(`/dataset/${data.key}`, data);
};

export const deleteDataset = key => {
  return axiosInstance.delete(`/dataset/${key}`);
};

export const getDatasetOverview = async key => {
  const [{ data: dataset }, { data: constituents }, { data: process }] = await Promise.all([
    getDataset(key),
    getConstituentDataset(key, { limit: 0 }),
    getDatasetProcessHistory(key, { limit: 0 })
  ]);
  const [{ data: publishingOrganization }, { data: installation }] = await Promise.all([
    getOrganization(dataset.publishingOrganizationKey),
    getInstallation(dataset.installationKey)
  ]);
  let parentDataset;
  let duplicateDataset;
  if (dataset.parentDatasetKey) {
    parentDataset = (await getDataset(dataset.parentDatasetKey)).data;
  }
  if (dataset.duplicateOfDatasetKey) {
    duplicateDataset = (await getDataset(dataset.duplicateOfDatasetKey)).data;
  }

  return {
    dataset: {
      ...dataset,
      publishingOrganization,
      installation,
      parentDataset,
      duplicateDataset
    },
    constituents,
    process
  };
};

export const getDataset = key => {
  return axiosInstance.get(`/dataset/${key}`);
};

export const getDatasetProcessHistory = async (key, query) => {
  // return axiosInstance.get(`/dataset/${key}/process?${qs.stringify(query)}`);
  return { data: {"offset":0,"limit":25,"endOfRecords":false,"count":67,"results":[{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":67},"startedCrawling":"2019-01-27T23:28:10.604+0000","finishedCrawling":"2019-01-30T03:53:35.677+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7662,"pagesFragmentedSuccessful":7662,"pagesFragmentedError":0,"fragmentsEmitted":7047914,"fragmentsReceived":7047914,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":7047914,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7047914,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":66},"startedCrawling":"2019-01-19T06:01:13.470+0000","finishedCrawling":"2019-01-20T23:10:36.992+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":6234,"pagesFragmentedSuccessful":6234,"pagesFragmentedError":0,"fragmentsEmitted":5604655,"fragmentsReceived":5604655,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":5604655,"rawOccurrencesPersistedError":0,"fragmentsProcessed":5604655,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":65},"startedCrawling":"2019-01-09T23:21:19.808+0000","finishedCrawling":"2019-01-12T05:43:05.196+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7990,"pagesFragmentedSuccessful":7990,"pagesFragmentedError":0,"fragmentsEmitted":7376160,"fragmentsReceived":7376160,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":24417,"rawOccurrencesPersistedUnchanged":7351743,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7376160,"verbatimOccurrencesPersistedSuccessful":24417,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":24417,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":64},"startedCrawling":"2018-12-31T12:25:22.960+0000","finishedCrawling":"2019-01-02T19:00:52.500+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":8030,"pagesFragmentedSuccessful":8030,"pagesFragmentedError":0,"fragmentsEmitted":7419456,"fragmentsReceived":7419456,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":7419456,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7419456,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":63},"startedCrawling":"2018-12-21T19:55:27.943+0000","finishedCrawling":"2018-12-23T19:29:58.685+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7105,"pagesFragmentedSuccessful":7105,"pagesFragmentedError":0,"fragmentsEmitted":6486996,"fragmentsReceived":6486996,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":6486996,"rawOccurrencesPersistedError":0,"fragmentsProcessed":6486996,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":62},"startedCrawling":"2018-12-12T14:24:42.946+0000","finishedCrawling":"2018-12-14T19:28:42.735+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7774,"pagesFragmentedSuccessful":7774,"pagesFragmentedError":0,"fragmentsEmitted":7162992,"fragmentsReceived":7162992,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":7162992,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7162992,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":61},"startedCrawling":"2018-12-03T13:49:29.138+0000","finishedCrawling":"2018-12-05T14:10:10.578+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7162,"pagesFragmentedSuccessful":7162,"pagesFragmentedError":0,"fragmentsEmitted":6546895,"fragmentsReceived":6546895,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":6546895,"rawOccurrencesPersistedError":0,"fragmentsProcessed":6546895,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":60},"startedCrawling":"2018-11-21T21:09:27.199+0000","finishedCrawling":"2018-11-23T23:09:01.188+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7403,"pagesFragmentedSuccessful":7403,"pagesFragmentedError":0,"fragmentsEmitted":6783598,"fragmentsReceived":6783598,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":385078,"rawOccurrencesPersistedUnchanged":6398520,"rawOccurrencesPersistedError":0,"fragmentsProcessed":6783598,"verbatimOccurrencesPersistedSuccessful":385078,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":385078,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":59},"startedCrawling":"2018-11-12T09:38:34.724+0000","finishedCrawling":"2018-11-14T20:51:08.068+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":8381,"pagesFragmentedSuccessful":8381,"pagesFragmentedError":0,"fragmentsEmitted":7772486,"fragmentsReceived":7772486,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":7772486,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7772486,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":58},"startedCrawling":"2018-11-02T19:53:07.773+0000","finishedCrawling":"2018-11-04T19:22:54.895+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7085,"pagesFragmentedSuccessful":7085,"pagesFragmentedError":0,"fragmentsEmitted":6466024,"fragmentsReceived":6466024,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":6466024,"rawOccurrencesPersistedError":0,"fragmentsProcessed":6466024,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":57},"startedCrawling":"2018-10-24T15:37:32.416+0000","finishedCrawling":"2018-10-26T18:31:25.374+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7424,"pagesFragmentedSuccessful":7424,"pagesFragmentedError":0,"fragmentsEmitted":6806803,"fragmentsReceived":6806803,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":33798,"rawOccurrencesPersistedUnchanged":6773005,"rawOccurrencesPersistedError":0,"fragmentsProcessed":6806803,"verbatimOccurrencesPersistedSuccessful":33798,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":33798,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":56},"startedCrawling":"2018-10-15T07:11:57.655+0000","finishedCrawling":"2018-10-17T15:30:41.435+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":8174,"pagesFragmentedSuccessful":8175,"pagesFragmentedError":0,"fragmentsEmitted":7560554,"fragmentsReceived":7560554,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":1033891,"rawOccurrencesPersistedUnchanged":6526663,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7560554,"verbatimOccurrencesPersistedSuccessful":1033891,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":1033891,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":55},"startedCrawling":"2018-10-06T17:04:48.342+0000","finishedCrawling":"2018-10-08T07:02:48.181+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":5815,"pagesFragmentedSuccessful":5815,"pagesFragmentedError":0,"fragmentsEmitted":5184350,"fragmentsReceived":5184350,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":1068575,"rawOccurrencesPersistedUnchanged":4115775,"rawOccurrencesPersistedError":0,"fragmentsProcessed":5184350,"verbatimOccurrencesPersistedSuccessful":1068575,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":1068575,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":54},"startedCrawling":"2018-09-27T12:34:33.170+0000","finishedCrawling":"2018-09-29T16:47:58.117+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7645,"pagesFragmentedSuccessful":7645,"pagesFragmentedError":0,"fragmentsEmitted":7032128,"fragmentsReceived":7032128,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":7032128,"rawOccurrencesPersistedUnchanged":0,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7032128,"verbatimOccurrencesPersistedSuccessful":7032128,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":7032128,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":53},"startedCrawling":"2018-09-18T09:53:15.099+0000","finishedCrawling":"2018-09-20T12:13:19.632+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7896,"pagesFragmentedSuccessful":7896,"pagesFragmentedError":0,"fragmentsEmitted":7282800,"fragmentsReceived":7282800,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":68088,"rawOccurrencesPersistedUnchanged":7214712,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7282800,"verbatimOccurrencesPersistedSuccessful":68088,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":68088,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":52},"startedCrawling":"2018-09-04T02:34:05.519+0000","finishedCrawling":"2018-09-06T04:19:19.540+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7768,"pagesFragmentedSuccessful":7768,"pagesFragmentedError":0,"fragmentsEmitted":7149482,"fragmentsReceived":7149482,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":7149482,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7149482,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":51},"startedCrawling":"2018-08-26T15:30:58.099+0000","finishedCrawling":"2018-08-28T02:28:33.163+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":5620,"pagesFragmentedSuccessful":5620,"pagesFragmentedError":0,"fragmentsEmitted":4985471,"fragmentsReceived":4985471,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":4985471,"rawOccurrencesPersistedError":0,"fragmentsProcessed":4985471,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":50},"startedCrawling":"2018-08-17T16:01:55.047+0000","finishedCrawling":"2018-08-19T15:05:04.195+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7454,"pagesFragmentedSuccessful":7454,"pagesFragmentedError":0,"fragmentsEmitted":6837357,"fragmentsReceived":6837357,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":6837357,"rawOccurrencesPersistedError":0,"fragmentsProcessed":6837357,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":49},"startedCrawling":"2018-08-08T10:44:40.994+0000","finishedCrawling":"2018-08-10T15:34:24.294+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":8263,"pagesFragmentedSuccessful":8263,"pagesFragmentedError":0,"fragmentsEmitted":7653006,"fragmentsReceived":7653006,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":7653006,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7653006,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":48},"startedCrawling":"2018-07-30T04:15:08.604+0000","finishedCrawling":"2018-08-01T10:25:18.989+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":8118,"pagesFragmentedSuccessful":8118,"pagesFragmentedError":0,"fragmentsEmitted":7503746,"fragmentsReceived":7503746,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":7503746,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7503746,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":47},"startedCrawling":"2018-07-21T15:39:25.069+0000","finishedCrawling":"2018-07-23T04:07:28.421+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":5878,"pagesFragmentedSuccessful":5878,"pagesFragmentedError":0,"fragmentsEmitted":5248576,"fragmentsReceived":5248576,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":5248576,"rawOccurrencesPersistedError":0,"fragmentsProcessed":5248576,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":46},"startedCrawling":"2018-07-12T03:35:29.895+0000","finishedCrawling":"2018-07-14T15:34:40.838+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":9103,"pagesFragmentedSuccessful":9103,"pagesFragmentedError":0,"fragmentsEmitted":8493917,"fragmentsReceived":8493917,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":8493917,"rawOccurrencesPersistedError":0,"fragmentsProcessed":8493917,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":45},"startedCrawling":"2018-06-19T10:47:58.634+0000","finishedCrawling":"2018-06-21T15:26:41.220+0000","finishReason":"NORMAL","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":7873,"pagesFragmentedSuccessful":7873,"pagesFragmentedError":0,"fragmentsEmitted":7259289,"fragmentsReceived":7259289,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":7259289,"rawOccurrencesPersistedError":0,"fragmentsProcessed":7259289,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":44},"startedCrawling":"2018-06-12T00:24:17.271+0000","finishedCrawling":"2018-06-12T10:34:06.056+0000","finishReason":"ABORT","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":1332,"pagesFragmentedSuccessful":1332,"pagesFragmentedError":0,"fragmentsEmitted":1287951,"fragmentsReceived":1287951,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":1287951,"rawOccurrencesPersistedError":0,"fragmentsProcessed":1287951,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0},{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","crawlJob":{"datasetKey":"e6fab7b3-c733-40b9-8df3-2a03e49532c1","endpointType":"BIOCASE","targetUrl":"http://www.floraweb.de/biocase/pywrapper.cgi?dsa=FlorKart2","attempt":43},"startedCrawling":"2018-06-01T11:15:02.890+0000","finishedCrawling":"2018-06-01T12:41:49.382+0000","finishReason":"ABORT","processStateOccurrence":"FINISHED","processStateChecklist":"EMPTY","pagesCrawled":107,"pagesFragmentedSuccessful":107,"pagesFragmentedError":0,"fragmentsEmitted":104267,"fragmentsReceived":104267,"rawOccurrencesPersistedNew":0,"rawOccurrencesPersistedUpdated":0,"rawOccurrencesPersistedUnchanged":104267,"rawOccurrencesPersistedError":0,"fragmentsProcessed":104267,"verbatimOccurrencesPersistedSuccessful":0,"verbatimOccurrencesPersistedError":0,"interpretedOccurrencesPersistedSuccessful":0,"interpretedOccurrencesPersistedError":0}]} }
};

export const deleteContact = (key, contactKey) => {
  return axiosInstance.delete(`/dataset/${key}/contact/${contactKey}`);
};

export const updateContact = (key, contactData) => {
  return axiosInstance.put(`/dataset/${key}/contact/${contactData.key}`, contactData);
};

export const createContact = (key, contactData) => {
  return axiosInstance.post(`/dataset/${key}/contact`, contactData);
};

export const deleteEndpoint = (key, endpointKey) => {
  return axiosInstance.delete(`/dataset/${key}/endpoint/${endpointKey}`);
};

export const createEndpoint = (key, endpointData) => {
  return axiosInstance.post(`/dataset/${key}/endpoint`, endpointData);
};

export const deleteIdentifier = (key, identifierKey) => {
  return axiosInstance.delete(`/dataset/${key}/identifier/${identifierKey}`);
};

export const createIdentifier = (key, identifierData) => {
  return axiosInstance.post(`/dataset/${key}/identifier`, identifierData);
};

export const deleteTag = (key, tagKey) => {
  return axiosInstance.delete(`/dataset/${key}/tag/${tagKey}`);
};

export const createTag = (key, tagData) => {
  return axiosInstance.post(`/dataset/${key}/tag`, tagData);
};

export const deleteMachineTag = (key, machineTagKey) => {
  return axiosInstance.delete(`/dataset/${key}/machineTag/${machineTagKey}`);
};

export const createMachineTag = (key, machineTagData) => {
  return axiosInstance.post(`/dataset/${key}/machineTag`, machineTagData);
};

export const deleteComment = (key, commentKey) => {
  return axiosInstance.delete(`/dataset/${key}/comment/${commentKey}`);
};

export const createComment = (key, commentData) => {
  return axiosInstance.post(`/dataset/${key}/comment`, commentData);
};

export const getConstituentDataset = (key, query) => {
  return axios_cancelable.get(`/dataset/${key}/constituents?${qs.stringify(query)}`);
};

export const crawlDataset = key => {
  return axiosInstance.post(`/dataset/${key}/crawl`);
};
