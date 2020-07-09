const environments = {
  prod: {
    gbifUrl: 'https://www.gbif.org',
    dataApi: 'https://registry-api.gbif.org',
    dataApi_v1: 'https://api.gbif.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    languages: [{ key: 'en', code: '🇬🇧', name: 'English' }]
  },
  uat: {
    gbifUrl: 'https://www.gbif-uat.org',
    dataApi: 'https://registry-api.gbif-uat.org',
    dataApi_v1: 'https://api.gbif-uat.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    languages: [{ key: 'en', code: '🇬🇧', name: 'English' }]
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
      { key: 'da', code: '🇩🇰', name: 'Dansk' }
    ]
  },
  demo: {
    gbifUrl: 'https://www.demo.gbif-dev.org',
    dataApi: 'https://registry-api.demo.gbif-dev.org',
    dataApi_v1: 'https://api.demo.gbif-dev.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    env: 'demo',
    languages: [
      { key: 'en', code: '🇬🇧', name: 'English' },
      { key: 'he', code: 'HE', name: 'Hebrew' },
      { key: 'kk', code: '🇰🇿', name: 'Қазақша' },
      { key: 'da', code: '🇩🇰', name: 'Dansk' }
    ]
  },
  local: {
    gbifUrl: process.env.REACT_APP_URL || 'https://www.gbif-dev.org',
    dataApi: process.env.REACT_APP_API || 'https://registry-api.gbif-dev.org',
    dataApi_v1: process.env.REACT_APP_API_V1 || 'https://api.gbif-dev.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    env: 'dev',
    languages: [
      { key: 'en', code: '🇬🇧', name: 'English' },
      { key: 'he', code: 'HE', name: 'Hebrew' },
      { key: 'kk', code: '🇰🇿', name: 'Қазақша' },
      { key: 'da', code: '🇩🇰', name: 'Dansk' }
    ]
  }
};

const domain = window.location.hostname;

let env = environments.uat;
if (domain.endsWith('gbif.org')) {
  env = environments.prod;
} else if (domain.endsWith('gbif-uat.org')) {
  env = environments.uat;
} else if (domain.endsWith('demo.gbif-dev.org')) {
  env = process.env.REACT_APP_URL || environments.demo;
} else if (domain.endsWith('gbif-dev.org')) {
  env = process.env.REACT_APP_URL || environments.dev;
}

export default env;
