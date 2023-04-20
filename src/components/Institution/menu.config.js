const menuConfig = {
  menu: [
    {
      key: 'institution',
      to: '/institution/',
      title: {
        id: 'institution',
        default: 'Institution'
      }
    },
    {
      key: 'contact',
      to: '/institution/',
      title: {
        id: 'contacts',
        default: 'Contacts'
      },
      subtype: 'contact',
      count: 'contacts',
      hideOnNew: true
    },
    {
      key: 'identifier',
      to: '/institution/',
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
      to: '/institution/',
      title: {
        id: 'tags',
        default: 'Tags'
      },
      subtype: 'tag',
      count: 'tags',
      hideOnNew: true
    },
    {
      key: 'collection',
      to: '/institution/',
      title: {
        id: 'collections',
        default: 'Collections'
      },
      subtype: 'collection',
      count: 'collections',
      hideOnNew: true
    },
    {
      key: 'machineTag',
      to: '/institution/',
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
      to: '/institution/',
      title: {
        id: 'comments',
        default: 'Comments'
      },
      subtype: 'comment',
      count: 'comments',      
      hideOnNew: true
    },
    {
      key: 'masterSource',
      to: '/institution/',
      title: {
        id: 'masterSource',
        default: 'Master source'
      },
      subtype: 'master-source',
      hideOnNew: true
    },
    {
      key: 'suggestions',
      to: ({params}) => `/suggestions/institutions?status=PENDING&entityKey=${params.key}`,
      title: {
        id: 'suggestions',
        default: 'Suggestions'
      },
      subtype: 'suggestions',
      count: 'suggestions',
      hideOnNew: true
    },
  ],
  settings: {
    link: 'grscicoll/institution'
  }
};
export default menuConfig;