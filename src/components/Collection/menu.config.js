const menuConfig = {
  menu: [
    {
      key: 'collection',
      to: '/collection/',
      title: {
        id: 'collection',
        default: 'Collection'
      }
    },
    {
      key: 'descriptorGroups',
      to: '/collection/',
      title: {
        id: 'collectionDescriptorGroups',
        default: 'Descriptor groups'
      },
      subtype: 'descriptorGroup',
      count: 'descriptorGroups',
      hideOnNew: true
    },
    {
      key: 'contact',
      to: '/collection/',
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
      to: '/collection/',
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
      to: '/collection/',
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
      to: '/collection/',
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
      to: '/collection/',
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
      to: '/collection/',
      title: {
        id: 'masterSource',
        default: 'Master source'
      },
      subtype: 'master-source',
      hideOnNew: true
    },
    {
      key: 'suggestions',
      to: ({params}) => `/suggestions/collections?status=PENDING&entityKey=${params.key}`,
      title: {
        id: 'suggestions',
        default: 'Suggestions'
      },
      subtype: 'suggestions',
      count: 'suggestions',
      hideOnNew: true
    },
    {
      key: 'descriptorSuggestions',
      to: ({params}) => `/collection/${params.key}/descriptorGroup/suggestion`,
      title: {
        id: 'collectionDescriptorSuggestions',
        default: 'Descriptor suggestions'
      },
      subtype: 'descriptorSuggestion',
      count: 'descriptorSuggestions',
      hideOnNew: true
    }
  ],
  settings: {
    link: 'grscicoll/collection'
  }
};

export default menuConfig;