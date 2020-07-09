export default {
    menu: [
       
          {
            key: 'concept',
            to: '/vocabulary/',
            title: {
              id: 'concept',
              default: 'Concept'
            },
            subtype: 'concept',
            hideOnNew: false
          },
          {
            key: 'children',
            to: '/vocabulary/',
            title: {
              id: 'children',
              default: 'Children'
            },
            subtype: 'concept',
            subTypeSection: 'children',
            count: 'children'
          }
      
    ],
    settings: {
      
    }
  };