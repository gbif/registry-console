export default {
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
    }
  ],
  settings: {
    link: 'grscicoll/collection'
  }
};