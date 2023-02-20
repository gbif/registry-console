const menuConfig = {
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
      key: 'alternativeLabels',
      to: '/vocabulary/',
      title: {
        id: 'alternativeLabels',
        default: 'Alternative Labels'
      },
      subtype: 'concept',
      subTypeSection: 'alternativeLabels',
      count: 'alternativeLabels'
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
export default menuConfig;