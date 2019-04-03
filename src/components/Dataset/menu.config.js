export default {
  menu: [
    {
      key: 'dataset',
      to: '/dataset/',
      title: {
        id: 'dataset',
        default: 'Dataset'
      }
    },
    {
      key: 'contact',
      to: '/dataset/',
      title: {
        id: 'contacts',
        default: 'Contacts'
      },
      subtype: 'contact',
      count: 'contacts',
      hideOnNew: true
    },
    {
      key: 'defaultValue',
      to: '/dataset/',
      title: {
        id: 'defaultValues',
        default: 'Default values'
      },
      subtype: 'defaultValue',
      count: 'defaultValues',
      hideOnNew: true
    },
    {
      key: 'endpoint',
      to: '/dataset/',
      title: {
        id: 'endpoints',
        default: 'Endpoints'
      },
      subtype: 'endpoint',
      count: 'endpoints',
      hideOnNew: true
    },
    {
      key: 'identifier',
      to: '/dataset/',
      title: {
        id: 'identifiers',
        default: 'Identifiers'
      },
      subtype: 'identifier',
      count: 'identifiers',
      hideOnNew: true
    },
    {
      key: 'tag',
      to: '/dataset/',
      title: {
        id: 'tags',
        default: 'Tags'
      },
      subtype: 'tag',
      count: 'tags',
      hideOnNew: true
    },
    {
      key: 'machineTag',
      to: '/dataset/',
      title: {
        id: 'machineTags',
        default: 'Machine Tags'
      },
      subtype: 'machineTag',
      count: 'machineTags',
      hideOnNew: true
    },
    {
      key: 'comment',
      to: '/dataset/',
      title: {
        id: 'comments',
        default: 'Comments'
      },
      subtype: 'comment',
      count: 'comments',
      roles: ['REGISTRY_ADMIN'],
      hideOnNew: true
    },
    {
      key: 'constituents',
      to: '/dataset/',
      title: {
        id: 'constituentsDatasets',
        default: 'Constituents datasets'
      },
      subtype: 'constituents',
      count: 'constituents',
      hideOnNew: true
    },
    {
      key: 'networks',
      to: '/dataset/',
      title: {
        id: 'networks',
        default: 'Networks'
      },
      subtype: 'networks',
      count: 'networks',
      hideOnNew: true
    },
    {
      key: 'crawlHistory',
      to: '/dataset/',
      title: {
        id: 'crawlHistory',
        default: 'Crawl history'
      },
      subtype: 'process',
      count: 'process',
      hideOnNew: true
    }
  ],
  settings: {
    link: 'dataset'
  }
};