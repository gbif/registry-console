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
    type: 'submenu',
    key: 'installation',
    title: {
      icon: 'hdd',
      message: {
        id: 'menu.installation',
        default: 'Installations'
      }
    },
    children: [
      {
        type: 'item',
        key: '/installation/search',
        title: {
          message: {
            id: 'menu.installation.search',
            default: 'Search'
          }
        }
      },
      {
        type: 'item',
        key: '/installation/deleted',
        title: {
          message: {
            id: 'menu.installation.deleted',
            default: 'Deleted'
          }
        }
      },
      {
        type: 'item',
        key: '/installation/nonPublishing',
        title: {
          message: {
            id: 'menu.installation.empty',
            default: 'Empty installations'
          }
        }
      }
    ]
  },
  {
    type: 'submenu',
    key: 'collection',
    title: {
      icon: 'gold',
      message: {
        id: 'menu.collection',
        default: 'Collections'
      }
    },
    children: [
      {
        type: 'item',
        key: '/collection/search',
        title: {
          message: {
            id: 'menu.collection.search',
            default: 'Search collections'
          }
        }
      },
      {
        type: 'item',
        key: '/collection/deleted',
        title: {
          message: {
            id: 'menu.collection.deleted',
            default: 'Deleted'
          }
        }
      }
    ]
  },
  {
    type: 'submenu',
    key: 'institution',
    title: {
      icon: 'bank',
      message: {
        id: 'menu.institution',
        default: 'Institutions'
      }
    },
    children: [
      {
        type: 'item',
        key: '/institution/search',
        title: {
          message: {
            id: 'menu.institution.search',
            default: 'Search institutions'
          }
        }
      },
      {
        type: 'item',
        key: '/institution/deleted',
        title: {
          message: {
            id: 'menu.institution.deleted',
            default: 'Deleted'
          }
        }
      }
    ]
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