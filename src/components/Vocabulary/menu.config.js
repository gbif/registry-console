export default {
  menu: [
    {
      key: 'vocabulary',
      to: '/vocabulary/',
      title: {
        id: 'vocabulary',
        default: 'Vocabulary'
      }
    },
    {
      key: 'concept',
      to: '/vocabulary/',
      title: {
        id: 'concepts',
        default: 'Concepts'
      },
      subtype: 'concepts',
      count: 'concepts',
      hideOnNew: true
    }

  ],
  settings: {
    
  }
};