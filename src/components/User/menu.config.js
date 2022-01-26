const menuConfig = {
  menu: [
    {
      key: 'user',
      to: '/user/',
      title: {
        id: 'user',
        default: 'user'
      }
    },
    {
      key: 'download',
      to: '/user/',
      title: {
        id: 'download',
        default: 'download'
      },
      subtype: 'download',
      count: 'download',
      hideOnNew: true
    },
    {
      key: 'derived-dataset',
      to: '/user/',
      title: {
        id: 'derivedDataset',
        default: 'Derived datasets'
      },
      subtype: 'derived-dataset',
      count: 'derivedDatasets',
      hideOnNew: true
    }
  ]
};
export default menuConfig;