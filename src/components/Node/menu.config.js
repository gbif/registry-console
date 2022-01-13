const menuConfig = {
  menu: [
    {
      key: 'node',
      to: '/node/',
      title: {
        id: 'node',
        default: 'Node'
      }
    },
    {
      key: 'contact',
      to: '/node/',
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
      to: '/node/',
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
      to: '/node/',
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
      to: '/node/',
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
      to: '/node/',
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
      to: '/node/',
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
      key: 'pending',
      to: '/node/',
      title: {
        id: 'pendingEndorsements',
        default: 'Pending endorsements'
      },
      subtype: 'pending',
      count: 'pending',
      hideOnNew: true
    },
    {
      key: 'organization',
      to: '/node/',
      title: {
        id: 'endorsedOrganizations',
        default: 'Endorsed organizations'
      },
      subtype: 'organization',
      count: 'organizations',
      hideOnNew: true
    },
    {
      key: 'dataset',
      to: '/node/',
      title: {
        id: 'endorsedDatasets',
        default: 'Endorsed datasets'
      },
      subtype: 'dataset',
      count: 'datasets',
      hideOnNew: true
    },
    {
      key: 'installation',
      to: '/node/',
      title: {
        id: 'installations',
        default: 'Installations'
      },
      subtype: 'installation',
      count: 'installations',
      hideOnNew: true
    }
  ],
  settings: {
    link: 'node'
  }
};
export default menuConfig;