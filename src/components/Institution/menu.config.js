export default [
  {
    key: 'institution',
    to: '/grbio/institution/',
    title: {
      id: 'institution',
      default: 'Institution'
    }
  },
  {
    key: 'contact',
    to: '/grbio/institution/',
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
    to: '/grbio/institution/',
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
    to: '/grbio/institution/',
    title: {
      id: 'tags',
      default: 'Tags'
    },
    subtype: 'tag',
    count: 'tags',
    hideOnNew: true
  }
];