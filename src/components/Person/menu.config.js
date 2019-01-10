export default [
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
  }
];