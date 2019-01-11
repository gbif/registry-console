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
  // return axios_cancelable.get(`/occurrence/download/user/${key}?${qs.stringify(query)}`);
  return {data: fakeDownloadDataAsEndpointsIsBrokenInDemo};
};

export const getUserOverview = async key => {
  const user = (await getUser(key)).data;
  const downloads = (await getDownloads(key, { limit: 0 })).data;
  return {
    user,
    downloads
  };
};

const fakeDownloadDataAsEndpointsIsBrokenInDemo = {
  "offset": 0,
  "limit": 23,
  "endOfRecords": true,
  "count": 23,
  "results": [
    {
      "key": "0000117-181121175518854",
      "doi": "10.5072/dl.u5voqv",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "or",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "HUMAN_OBSERVATION"
            },
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "MATERIAL_SAMPLE"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2018-11-28T12:57:20.323+0000",
      "modified": "2018-11-28T12:57:22.853+0000",
      "eraseAfter": "2019-05-28T12:57:20.197+0000",
      "status": "CANCELLED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000117-181121175518854.zip",
      "size": 0,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000116-181121175518854",
      "doi": "10.5072/dl.ymiwet",
      "license": "unspecified",
      "request": {
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2018-11-28T12:45:23.046+0000",
      "modified": "2018-11-28T12:45:26.509+0000",
      "eraseAfter": "2019-05-28T12:45:22.874+0000",
      "status": "CANCELLED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000116-181121175518854.zip",
      "size": 0,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000115-181121175518854",
      "doi": "10.5072/dl.avqpac",
      "license": "http://creativecommons.org/licenses/by/4.0/legalcode",
      "request": {
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2018-11-28T12:22:24.315+0000",
      "modified": "2018-11-28T12:22:59.930+0000",
      "eraseAfter": "2019-05-28T12:22:24.148+0000",
      "status": "SUCCEEDED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000115-181121175518854.zip",
      "size": 25159,
      "totalRecords": 915,
      "numberDatasets": 1
    },
    {
      "key": "0000132-180109225247373",
      "doi": "10.5072/dl.ly7p2w",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "equals",
              "key": "MONTH",
              "value": "2"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2018-02-08T11:43:59.532+0000",
      "modified": "2018-02-08T11:44:04.175+0000",
      "eraseAfter": "2018-08-08T11:43:59.426+0000",
      "status": "CANCELLED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000132-180109225247373.zip",
      "size": 0,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000131-180109225247373",
      "doi": "10.5072/dl.mxfkq6",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "equals",
              "key": "MONTH",
              "value": "1"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2018-02-08T11:42:38.205+0000",
      "modified": "2018-02-08T11:42:45.561+0000",
      "eraseAfter": "2018-08-08T11:42:38.106+0000",
      "status": "CANCELLED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000131-180109225247373.zip",
      "size": 0,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000130-180109225247373",
      "doi": "10.5072/dl.ikrytw",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "equals",
              "key": "MONTH",
              "value": "1"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2018-02-08T11:36:29.119+0000",
      "modified": "2018-02-08T11:36:35.853+0000",
      "eraseAfter": "2018-08-08T11:36:29.000+0000",
      "status": "CANCELLED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000130-180109225247373.zip",
      "size": 0,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000129-180109225247373",
      "doi": "10.5072/dl.3bo9nc",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "equals",
              "key": "MONTH",
              "value": "1"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2018-02-08T11:30:51.674+0000",
      "modified": "2018-02-08T11:30:56.293+0000",
      "eraseAfter": "2018-08-08T11:30:51.401+0000",
      "status": "CANCELLED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000129-180109225247373.zip",
      "size": 0,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000071-171031135223121",
      "doi": "10.5072/dl.wlm2dt",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "equals",
          "key": "LICENSE",
          "value": "UNSPECIFIED"
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-11-22T08:09:06.064+0000",
      "modified": "2017-11-22T08:09:27.388+0000",
      "status": "CANCELLED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000071-171031135223121.zip",
      "size": 0,
      "totalRecords": 2978,
      "numberDatasets": 0
    },
    {
      "key": "0000069-171031135223121",
      "doi": "10.5072/dl.6c5t5w",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "equals",
          "key": "TAXON_KEY",
          "value": "2435098"
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-11-21T13:49:48.931+0000",
      "modified": "2017-11-21T13:49:58.661+0000",
      "status": "CANCELLED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000069-171031135223121.zip",
      "size": 0,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000009-170816211013654",
      "doi": "10.5072/dl.sg2rrr",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "or",
              "predicates": [
                {
                  "type": "equals",
                  "key": "BASIS_OF_RECORD",
                  "value": "OBSERVATION"
                },
                {
                  "type": "equals",
                  "key": "BASIS_OF_RECORD",
                  "value": "LITERATURE"
                },
                {
                  "type": "equals",
                  "key": "BASIS_OF_RECORD",
                  "value": "PRESERVED_SPECIMEN"
                },
                {
                  "type": "equals",
                  "key": "BASIS_OF_RECORD",
                  "value": "HUMAN_OBSERVATION"
                },
                {
                  "type": "equals",
                  "key": "BASIS_OF_RECORD",
                  "value": "MACHINE_OBSERVATION"
                },
                {
                  "type": "equals",
                  "key": "BASIS_OF_RECORD",
                  "value": "MATERIAL_SAMPLE"
                }
              ]
            },
            {
              "type": "equals",
              "key": "COUNTRY",
              "value": "MX"
            },
            {
              "type": "within",
              "geometry": "POLYGON ((-116.98242187499999 32.52458504923801, -132.890625 32.74662747466574, -132.890625 11.41972981423215, -84.90234375 11.299091230593271, -89.20898437499999 14.0683833118158, -92.724609375 15.059393614699374, -93.9990234375 16.412902065461612, -96.1962890625 16.202015517411237, -98.4814453125 16.5814469873171, -101.9970703125 18.216829462816218, -103.35937499999999 18.717016588574673, -105.2490234375 20.16734919430541, -104.853515625 21.726845216584174, -106.171875 23.63244728408054, -108.720703125 26.06467883641701, -110.7861328125 28.331461588646953, -111.97265625 29.21738484658348, -112.8955078125 30.928616463626792, -113.5986328125 31.75432837019855, -114.9169921875 31.940975861541617, -115.1806640625 31.21656002927879, -114.67529296874999 29.796797985361014, -113.115234375 28.279228628627674, -112.43408203124999 27.229233686607184, -111.81884765624999 26.30720393958023, -111.4892578125 26.090335193162165, -110.830078125 24.760799135572405, -110.8740234375 24.42114369064522, -110.21484375 24.04044437367387, -109.97314453125 23.879810568442664, -109.51171875 23.295847107320572, -109.92919921875 22.99278387204715, -110.5224609375 23.899900731994176, -112.0166015625 24.98008324458478, -112.08251953125 26.129795897440964, -113.37890625 26.974954341175273, -114.19189453125 27.42443912774298, -113.818359375 28.007981990389354, -114.58740234375 29.242311890868855, -115.59814453125001 29.93018293428911, -116.52099609375 31.74124868178526, -116.98242187499999 32.52458504923801))"
            },
            {
              "type": "equals",
              "key": "HAS_COORDINATE",
              "value": "true"
            },
            {
              "type": "equals",
              "key": "HAS_GEOSPATIAL_ISSUE",
              "value": "false"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-08-18T09:29:20.945+0000",
      "modified": "2017-08-18T09:29:35.369+0000",
      "status": "CANCELLED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000009-170816211013654.zip",
      "size": 0,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000347-160816095650326",
      "doi": "10.5072/dl.odrxzc",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "equals",
              "key": "TAXON_KEY",
              "value": "2435098"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "s"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-02-06T07:18:00.803+0000",
      "modified": "2017-02-06T07:18:41.287+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000347-160816095650326.zip",
      "size": 0,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000346-160816095650326",
      "doi": "10.5072/dl.khhnui",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "equals",
              "key": "TAXON_KEY",
              "value": "2435098"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-02-06T07:16:49.447+0000",
      "modified": "2017-02-06T07:17:30.075+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000346-160816095650326.zip",
      "size": 447,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000345-160816095650326",
      "doi": "10.5072/dl.lp8i6u",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "equals",
              "key": "TAXON_KEY",
              "value": "2435098"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-02-06T07:16:23.962+0000",
      "modified": "2017-02-06T07:17:05.608+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000345-160816095650326.zip",
      "size": 447,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000339-160816095650326",
      "doi": "10.5072/dl.hdywil",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "or",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "OBSERVATION"
            },
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "FOSSIL_SPECIMEN"
            },
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "HUMAN_OBSERVATION"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "mhoefft"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-02-02T14:57:00.064+0000",
      "modified": "2017-02-02T15:00:51.812+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000339-160816095650326.zip",
      "size": 87450711,
      "totalRecords": 1640404,
      "numberDatasets": 5
    },
    {
      "key": "0000338-160816095650326",
      "doi": "10.5072/dl.1fjmlp",
      "license": "http://creativecommons.org/licenses/by/4.0/legalcode",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "and",
              "predicates": [
                {
                  "type": "greaterThanOrEquals",
                  "key": "YEAR",
                  "value": "2002"
                },
                {
                  "type": "lessThanOrEquals",
                  "key": "YEAR",
                  "value": "2011"
                }
              ]
            },
            {
              "type": "equals",
              "key": "TAXON_KEY",
              "value": "2435098"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "DWCA"
      },
      "created": "2017-02-02T09:16:00.445+0000",
      "modified": "2017-02-02T09:16:39.775+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000338-160816095650326.zip",
      "size": 8010,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000337-160816095650326",
      "doi": "10.5072/dl.juhdij",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "and",
              "predicates": [
                {
                  "type": "greaterThanOrEquals",
                  "key": "YEAR",
                  "value": "2002"
                },
                {
                  "type": "lessThanOrEquals",
                  "key": "YEAR",
                  "value": "2011"
                }
              ]
            },
            {
              "type": "equals",
              "key": "TAXON_KEY",
              "value": "2435098"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "sdfg"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-02-02T09:15:03.343+0000",
      "modified": "2017-02-02T09:15:43.825+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000337-160816095650326.zip",
      "size": 447,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000336-160816095650326",
      "doi": "10.5072/dl.oumkle",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "and",
              "predicates": [
                {
                  "type": "greaterThanOrEquals",
                  "key": "YEAR",
                  "value": "2002"
                },
                {
                  "type": "lessThanOrEquals",
                  "key": "YEAR",
                  "value": "2011"
                }
              ]
            },
            {
              "type": "equals",
              "key": "TAXON_KEY",
              "value": "2435098"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "workmgh@gmail.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-02-02T09:04:44.658+0000",
      "modified": "2017-02-02T09:05:24.464+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000336-160816095650326.zip",
      "size": 447,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000335-160816095650326",
      "doi": "10.5072/dl.6bmtnz",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "OBSERVATION"
            },
            {
              "type": "equals",
              "key": "COUNTRY",
              "value": "NL"
            },
            {
              "type": "and",
              "predicates": [
                {
                  "type": "greaterThanOrEquals",
                  "key": "YEAR",
                  "value": "1987"
                },
                {
                  "type": "lessThanOrEquals",
                  "key": "YEAR",
                  "value": "1988"
                }
              ]
            },
            {
              "type": "equals",
              "key": "TAXON_KEY",
              "value": "42"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "none@gbif.org"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-02-02T06:57:18.503+0000",
      "modified": "2017-02-02T06:57:59.105+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000335-160816095650326.zip",
      "size": 447,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000334-160816095650326",
      "doi": "10.5072/dl.3nzv8l",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "equals",
              "key": "TAXON_KEY",
              "value": "2435098"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "none@gbif.org"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-02-01T17:23:29.734+0000",
      "modified": "2017-02-01T17:24:10.964+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000334-160816095650326.zip",
      "size": 447,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000332-160816095650326",
      "doi": "10.5072/dl.asuaxb",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "equals",
              "key": "TAXON_KEY",
              "value": "2435098"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-02-01T16:03:58.609+0000",
      "modified": "2017-02-01T16:04:37.332+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000332-160816095650326.zip",
      "size": 447,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000331-160816095650326",
      "doi": "10.5072/dl.hmsane",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "equals",
              "key": "TAXON_KEY",
              "value": "2435098"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-02-01T15:53:58.718+0000",
      "modified": "2017-02-01T15:54:39.292+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000331-160816095650326.zip",
      "size": 447,
      "totalRecords": 0,
      "numberDatasets": 0
    },
    {
      "key": "0000330-160816095650326",
      "doi": "10.5072/dl.z9ze9k",
      "license": "http://creativecommons.org/licenses/by/4.0/legalcode",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "COUNTRY",
              "value": "CH"
            },
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "FOSSIL_SPECIMEN"
            },
            {
              "type": "equals",
              "key": "DATASET_KEY",
              "value": "16463d8c-3aef-4c90-a948-22e7ad61e9bf"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-02-01T06:59:07.651+0000",
      "modified": "2017-02-01T06:59:50.223+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000330-160816095650326.zip",
      "size": 748,
      "totalRecords": 3,
      "numberDatasets": 1
    },
    {
      "key": "0000304-160816095650326",
      "doi": "10.5072/dl.nfszke",
      "license": "unspecified",
      "request": {
        "predicate": {
          "type": "and",
          "predicates": [
            {
              "type": "equals",
              "key": "BASIS_OF_RECORD",
              "value": "LITERATURE"
            },
            {
              "type": "equals",
              "key": "TAXON_KEY",
              "value": "2435098"
            }
          ]
        },
        "creator": "mhoefft",
        "notification_address": [
          "someemail@domain.com"
        ],
        "send_notification": true,
        "format": "SIMPLE_CSV"
      },
      "created": "2017-01-19T08:00:48.016+0000",
      "modified": "2017-01-19T08:01:28.252+0000",
      "status": "FILE_ERASED",
      "downloadLink": "http://api.gbif-dev.org/v1/occurrence/download/request/0000304-160816095650326.zip",
      "size": 447,
      "totalRecords": 0,
      "numberDatasets": 0
    }
  ]
};