export default [
  {
    key: 'collection',
    to: '/grbio/collection/',
    title: {
      id: 'collection',
      default: 'Collection'
    }
  },
  {
    key: 'contact',
    to: '/grbio/collection/',
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
    to: '/grbio/collection/',
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
    to: '/grbio/collection/',
    title: {
      id: 'tags',
      default: 'Tags'
    },
    subtype: 'tag',
    count: 'tags',
    hideOnNew: true
  }
];