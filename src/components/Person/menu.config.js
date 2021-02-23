export default {
  menu: [
    {
      key: 'person',
      to: '/person/',
      title: {
        id: 'person',
        default: 'Person'
      }
    },
    {
      key: 'collection',
      to: '/person/',
      title: {
        id: 'collections',
        default: 'Collections'
      },
      subtype: 'collection',
      count: 'collections',
      hideOnNew: true
    },
    {
      key: 'institution',
      to: '/person/',
      title: {
        id: 'institutions',
        default: 'Institutions'
      },
      subtype: 'institution',
      count: 'institutions',
      hideOnNew: true
    },
    {
      key: 'identifier',
      to: '/person/',
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
      to: '/person/',
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
      to: '/person/',
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
      to: '/person/',
      title: {
        id: 'comments',
        default: 'Comments'
      },
      subtype: 'comment',
      count: 'comments',
      auth: {
        roles: ['REGISTRY_ADMIN', 'GRSCICOLL_ADMIN', 'GRSCICOLL_EDITOR']
      },
      hideOnNew: true
    }
  ],
  settings: {
    link: 'grscicoll/person'
  }
};