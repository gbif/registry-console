export default [
  {
    type: 'item',
    key: '/organization/search',
    title: {
      icon: 'share-alt',
      message: {
        id: 'menu.organization',
        default: 'Organizations'
      }
    }
  },
  {
    type: 'item',
    key: '/dataset/search',
    title: {
      icon: 'table',
      message: {
        id: 'menu.dataset',
        default: 'Datasets'
      }
    }
  },
  {
    type: 'item',
    key: '/installation/search',
    title: {
      icon: 'hdd',
      message: {
        id: 'menu.installation',
        default: 'Installations'
      }
    }
  },
  {
    type: 'item',
    key: '/collection/search',
    title: {
      icon: 'gold',
      message: {
        id: 'menu.collection',
        default: 'Collections'
      }
    }
  },
  {
    type: 'item',
    key: '/institution/search',
    title: {
      icon: 'bank',
      message: {
        id: 'menu.institution',
        default: 'Institutions'
      }
    }
  },
  {
    type: 'submenu',
    key: 'person',
    title: {
      icon: 'team',
      message: {
        id: 'menu.grSciCollPerson',
        default: 'GrSciColl staff'
      }
    },
    children: [
      {
        type: 'item',
        key: '/person/search',
        title: {
          message: {
            id: 'menu.grSciCollPerson.search',
            default: 'Search GrSciColl staff'
          }
        }
      },
      {
        type: 'item',
        key: '/person/deleted',
        title: {
          message: {
            id: 'menu.grSciCollPerson.deleted',
            default: 'Deleted'
          }
        }
      }
    ]
  },
  {
    type: 'item',
    key: '/node/search',
    title: {
      icon: 'fork',
      message: {
        id: 'menu.node',
        default: 'Nodes'
      }
    }
  },
  {
    type: 'item',
    key: '/user/search',
    title: {
      icon: 'user',
      message: {
        id: 'menu.user',
        default: 'Users'
      }
    },
    roles: ['REGISTRY_ADMIN']
  },
  {
    type: 'submenu',
    key: 'monitoring',
    title: {
      icon: 'eye',
      message: {
        id: 'menu.monitoring',
        default: 'Monitoring'
      }
    },
    children: [
      {
        type: 'item',
        key: '/monitoring/ingestion',
        title: {
          message: {
            id: 'menu.monitoring.ingestion',
            default: 'Ingenstion monitor'
          }
        }
      },
      {
        type: 'item',
        key: '/monitoring/overingested',
        title: {
          message: {
            id: 'menu.monitoring.overingested',
            default: 'Overingested datasets'
          }
        }
      }
    ]
  }
];