const menuConfig = {
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
      key: 'concepts',
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
export default menuConfig;