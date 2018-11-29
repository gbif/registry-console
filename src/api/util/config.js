const environments = {
  prod: {
    dataApi: '//api.gbif.org/v1',
  },
  uat: {
    dataApi: '//api.gbif-uat.org/v1',
  },
  dev: {
    // dataApi: '//api.gbif-dev.org/v1',
    // dataApi: '//api-demo.gbif-dev.org/v1',
    dataApi: 'https://registry-demo.gbif-dev.org',
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

export default env