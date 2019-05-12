export default {
  menu: [
    {
      key: 'network',
      to: '/network/',
      title: {
        id: 'network',
        default: 'Network'
      }
    },
    {
      key: 'contact',
      to: '/network/',
      title: {
        id: 'contacts',
        default: 'Contacts'
      },
      subtype: 'contact',
      count: 'contacts',
      hideOnNew: true
    },
    {
      key: 'endpoint',
      to: '/network/',
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
      to: '/network/',
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
      to: '/network/',
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
      to: '/network/',
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
      to: '/network/',
      title: {
        id: 'comments',
        default: 'Comments'
      },
      subtype: 'comment',
      count: 'comments',
      auth: {
        roles: ['REGISTRY_ADMIN']
      },
      hideOnNew: true
    },
    {
      key: 'constituents',
      to: '/network/',
      title: {
        id: 'constituentsDatasets',
        default: 'Constituents datasets'
      },
      subtype: 'constituents',
      count: 'constituents',
      hideOnNew: true
    }
  ],
  settings: {
    link: 'network'
  }
};