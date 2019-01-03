export default [
  {
    key: 'person',
    to: '/grbio/person/',
    title: {
      id: 'person',
      default: 'Person'
    }
  },
  {
    key: 'collection',
    to: '/grbio/person/',
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
    to: '/grbio/person/',
    title: {
      id: 'institutions',
      default: 'Institutions'
    },
    subtype: 'institution',
    count: 'institutions',
    hideOnNew: true
  }
];