export default {
  menu: [
    {
      key: 'installation',
      to: '/installation/',
      title: {
        id: 'installation',
        default: 'Installation'
      }
    },
    {
      key: 'contact',
      to: '/installation/',
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
      to: '/installation/',
      title: {
        id: 'endpoints',
        default: 'Endpoints'
      },
      subtype: 'endpoint',
      count: 'endpoints',
      hideOnNew: true
    },
    {
      key: 'machineTag',
      to: '/installation/',
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
      to: '/installation/',
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
      key: 'servedDatasets',
      to: '/installation/',
      title: {
        id: 'servedDatasets',
        default: 'Served datasets'
      },
      subtype: 'servedDatasets',
      count: 'servedDataset',
      hideOnNew: true
    },
    {
      key: 'synchronizationHistory',
      to: '/installation/',
      title: {
        id: 'synchronizationHistory',
        default: 'Synchronization history'
      },
      subtype: 'synchronizationHistory',
      count: 'syncHistory',
      hideOnNew: true
    },
    {
      key: 'syncState',
      to: '/installation/',
      title: {
        id: 'syncState',
        default: 'Sync state'
      },
      subtype: 'syncState',
      hideOnNew: true
    }
  ],
  settings: {
    link: 'installation'
  }
};