export default {
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
    }
  ]
};