const menuConfig = {
  menu: [
    {
      key: 'organization',
      to: '/organization/',
      title: {
        id: 'organization',
        default: 'Organization'
      }
    },
    {
      key: 'contact',
      to: '/organization/',
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
      to: '/organization/',
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
      to: '/organization/',
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
      to: '/organization/',
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
      to: '/organization/',
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
      to: '/organization/',
      title: {
        id: 'comments',
        default: 'Comments'
      },
      subtype: 'comment',
      count: 'comments',
      auth: {
        useItemUUID: true 
      },
      hideOnNew: true
    },
    {
      key: 'publishedDataset',
      to: '/organization/',
      title: {
        id: 'publishedDataset',
        default: 'Published Dataset'
      },
      subtype: 'publishedDataset',
      count: 'publishedDataset',
      hideOnNew: true
    },
    {
      key: 'hostedDataset',
      to: '/organization/',
      title: {
        id: 'hostedDataset',
        default: 'Hosted Dataset'
      },
      subtype: 'hostedDataset',
      count: 'hostedDataset',
      hideOnNew: true
    },
    {
      key: 'installation',
      to: '/organization/',
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
    link: 'publisher'
  }
};
export default menuConfig;