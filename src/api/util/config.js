const logIndices = {
  prod: '439da4d0-290a-11ed-8155-a37cb1ead50e',
  uat: '37b11f80-290a-11ed-8155-a37cb1ead50e',
  dev: '83de8f50-6e64-11ee-8155-a37cb1ead50e'
};
const datasetLatestLogs  = "https://logs.gbif.org/app/discover#/?_g=(filters:!(),refreshInterval:(display:On,pause:!f,value:0),time:(from:now-7d,to:now))&_a=(columns:!(_source),filters:!(),index:'{{INDEX}}',interval:auto,query:(language:lucene,query:'datasetKey.keyword:%22{{UUID}}%22'),sort:!('@timestamp',desc))";
const datasetAttemptLogs = "https://logs.gbif.org/app/discover#/?_g=(filters:!(),refreshInterval:(display:On,pause:!f,value:0),time:(from:now-1y,to:now))&_a=(columns:!(_source),filters:!(),index:'{{INDEX}}',interval:auto,query:(language:lucene,query:'datasetKey.keyword:%22{{UUID}}%22%20AND%20attempt:%22{{ATTEMPT}}%22'),sort:!('@timestamp',desc))";

const environments = {
  prod: {
    gbifUrl: 'https://www.gbif.org',
    dataApi: 'https://registry-api.gbif.org',
    dataApi_v1: 'https://api.gbif.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    // notice that the language need to be loaded in /app.js so that we know how to format numbers etc.
    languages: [
      { key: 'en', name: 'English' },
      { key: 'fr', name: 'Français' },
      { key: 'es', name: 'Español' }
    ],
    logLinks: {
      datasetLatest: process.env.REACT_APP_LOG_DATASET_LATEST || datasetLatestLogs.replace('{{INDEX}}', logIndices.prod),
      datasetAttempt: process.env.REACT_APP_LOG_DATASET_ATTEMPT || datasetAttemptLogs.replace('{{INDEX}}', logIndices.prod)
    }
  },
  uat: {
    gbifUrl: 'https://www.gbif-uat.org',
    dataApi: 'https://registry-api.gbif-uat.org',
    dataApi_v1: 'https://api.gbif-uat.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    languages: [
      { key: 'en', code: '🇬🇧', name: 'English' },
      { key: 'fr', name: 'Français' },
      { key: 'es', name: 'Español' },
      { key: 'ru', name: 'Русский' }
    ],
    logLinks: {
      datasetLatest: process.env.REACT_APP_LOG_DATASET_LATEST || datasetLatestLogs.replace('{{INDEX}}', logIndices.uat),
      datasetAttempt: process.env.REACT_APP_LOG_DATASET_ATTEMPT || datasetAttemptLogs.replace('{{INDEX}}', logIndices.uat)
    }
  },
  uat2: {
    gbifUrl: 'https://www.gbif-uat2.org',
    dataApi: 'https://registry-api.gbif-uat2.org',
    dataApi_v1: 'https://api.gbif-uat2.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    languages: [
      { key: 'en', code: '🇬🇧', name: 'English' },
      { key: 'fr', name: 'Français' },
      { key: 'es', name: 'Español' },
      { key: 'ru', name: 'Русский' }
    ],
    logLinks: {
      datasetLatest: process.env.REACT_APP_LOG_DATASET_LATEST || datasetLatestLogs.replace('{{INDEX}}', logIndices.uat),
      datasetAttempt: process.env.REACT_APP_LOG_DATASET_ATTEMPT || datasetAttemptLogs.replace('{{INDEX}}', logIndices.uat)
    }
  },
  dev: {
    gbifUrl: 'https://www.gbif-dev.org',
    dataApi: 'https://registry-api.gbif-dev.org',
    dataApi_v1: 'https://api.gbif-dev.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    env: 'dev',
    languages: [
      { key: 'en', code: '🇬🇧', name: 'English' },
      { key: 'he', code: 'HE', name: 'Hebrew' },
      { key: 'kk', code: '🇰🇿', name: 'Қазақша' },
      { key: 'da', code: '🇩🇰', name: 'Dansk' },
      { key: 'es', name: 'Español' },
      { key: 'fr', name: 'Français' },
    ],
    logLinks: {
      datasetLatest: process.env.REACT_APP_LOG_DATASET_LATEST || datasetLatestLogs.replace('{{INDEX}}', logIndices.dev),
      datasetAttempt: process.env.REACT_APP_LOG_DATASET_ATTEMPT || datasetAttemptLogs.replace('{{INDEX}}', logIndices.dev)
    }
  },
  dev2: {
    gbifUrl: 'https://www.gbif-dev2.org',
    dataApi: 'https://registry-api.gbif-dev2.org',
    dataApi_v1: 'https://api.gbif-dev2.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    env: 'dev2',
    languages: [
      { key: 'en', code: '🇬🇧', name: 'English' },
      { key: 'he', code: 'HE', name: 'Hebrew' },
      { key: 'kk', code: '🇰🇿', name: 'Қазақша' },
      { key: 'da', code: '🇩🇰', name: 'Dansk' },
      { key: 'es', name: 'Español' },
      { key: 'fr', name: 'Français' },
    ],
    logLinks: {
      datasetLatest: process.env.REACT_APP_LOG_DATASET_LATEST || datasetLatestLogs.replace('{{INDEX}}', logIndices.dev2),
      datasetAttempt: process.env.REACT_APP_LOG_DATASET_ATTEMPT || datasetAttemptLogs.replace('{{INDEX}}', logIndices.dev2)
    }
  },
  local: {
    gbifUrl: process.env.REACT_APP_URL || 'https://www.gbif-uat.org',
    dataApi: process.env.REACT_APP_API || 'https://registry-api.gbif-uat.org',
    dataApi_v1: process.env.REACT_APP_API_V1 || 'https://api.gbif-uat.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    env: 'dev',
    languages: [
      { key: 'en', code: '🇬🇧', name: 'English' },
      { key: 'fr', name: 'Français' },
      { key: 'es', name: 'Español' },
      { key: 'da', code: '🇩🇰', name: 'Dansk' },
    ],
    logLinks: {
      datasetLatest: process.env.REACT_APP_LOG_DATASET_LATEST || datasetLatestLogs.replace('{{INDEX}}', logIndices.uat),
      datasetAttempt: process.env.REACT_APP_LOG_DATASET_ATTEMPT || datasetAttemptLogs.replace('{{INDEX}}', logIndices.uat)
    }
  }
};

const domain = window.location.hostname;

let env = environments.local; // psst: please create a local env file instead of changing this to another env during development. If you do need to change it, then please do not commit it.
if (domain.endsWith('gbif.org')) {
  env = environments.prod;
} else if (domain.endsWith('gbif-uat.org')) {
  env = environments.uat;
} else if (domain.endsWith('gbif-dev.org')) {
  env = process.env.REACT_APP_URL || environments.dev;
} else if (domain.endsWith('gbif-dev2.org')) {
  env = process.env.REACT_APP_URL || environments.dev2;
}

export default env;
