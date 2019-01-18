const environments = {
  prod: {
    gbifUrl: '//www.gbif.org',
    dataApi: '//api.gbif.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8'
  },
  uat: {
    gbifUrl: '//www.gbif-uat.org',
    dataApi: '//api.gbif-uat.org/v1',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8'
  },
  dev: {
    gbifUrl: 'https://www.gbif-dev.org',
    // dataApi: '//api.gbif-dev.org/v1',
    // dataApi: '//api-demo.gbif-dev.org/v1',
    dataApi: 'https://registry-demo.gbif-dev.org',
    secretariatNode: '02c40d2a-1cba-4633-90b7-e36e5e97aba8',
    env: 'dev'
  }
};

const domain = window.location.hostname;

let env = environments.dev;
if (domain.endsWith('gbif.org')) {
  env = environments.prod;
} else if (domain.endsWith('gbif-uat.org')) {
  env = environments.uat;
} else if (domain.endsWith('gbif-dev.org')) {
  env = environments.dev;
}

export default env;