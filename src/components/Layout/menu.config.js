export default [
  {
    type: 'submenu',
    key: 'organization',
    title: {
      icon: 'share-alt',
      message: {
        id: 'menu.organization',
        default: 'Organizations'
      }
    },
    children: [
      {
        type: 'item',
        key: '/organization/search',
        title: {
          message: {
            id: 'menu.search',
            default: 'Search'
          }
        }
      },
      {
        type: 'item',
        key: '/organization/deleted',
        title: {
          message: {
            id: 'menu.deleted',
            default: 'Deleted'
          }
        }
      },
      {
        type: 'item',
        key: '/organization/pending',
        title: {
          message: {
            id: 'menu.pending',
            default: 'Pending'
          }
        }
      },
      {
        type: 'item',
        key: '/organization/nonPublishing',
        title: {
          message: {
            id: 'menu.organizationNonPublishing',
            default: 'Non publishing organizations'
          }
        }
      }
    ]
  },
  {
    type: 'submenu',
    key: 'dataset',
    title: {
      icon: 'table',
      message: {
        id: 'menu.dataset',
        default: 'Datasets'
      }
    },
    children: [
      {
        type: 'item',
        key: '/dataset/search',
        title: {
          message: {
            id: 'menu.search',
            default: 'Search'
          }
        }
      },
      {
        type: 'item',
        key: '/dataset/deleted',
        title: {
          message: {
            id: 'menu.deleted',
            default: 'Deleted'
          }
        }
      },
      {
        type: 'item',
        key: '/dataset/duplicate',
        title: {
          message: {
            id: 'menu.duplicate',
            default: 'Duplicate'
          }
        }
      },
      {
        type: 'item',
        key: '/dataset/constituent',
        title: {
          message: {
            id: 'menu.constituent',
            default: 'Constituent'
          }
        }
      },
      {
        type: 'item',
        key: '/dataset/withNoEndpoint',
        title: {
          message: {
            id: 'menu.withNoEndpoint',
            default: 'With no endpoint'
          }
        }
      }
    ]
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
            id: 'menu.search',
            default: 'Search'
          }
        }
      },
      {
        type: 'item',
        key: '/installation/deleted',
        title: {
          message: {
            id: 'menu.deleted',
            default: 'Deleted'
          }
        }
      },
      {
        type: 'item',
        key: '/installation/nonPublishing',
        title: {
          message: {
            id: 'menu.installationNoDataset',
            default: 'Serving no datasets'
          }
        }
      }
    ]
  },
  {
    type: 'submenu',
    key: 'grbio',
    title: {
      icon: 'api',
      message: {
        id: 'menu.grbio',
        default: 'GRBIO'
      }
    },
    children: [
      {
        type: 'item',
        key: '/grbio/collection/search',
        title: {
          message: {
            id: 'menu.collection',
            default: 'Collections'
          }
        }
      },
      {
        type: 'item',
        key: '/grbio/institution/search',
        title: {
          message: {
            id: 'menu.institution',
            default: 'Institutions'
          }
        }
      },
      {
        type: 'item',
        key: '/grbio/person/search',
        title: {
          message: {
            id: 'menu.person',
            default: 'Persons'
          }
        }
      }
    ]
  },
  {
    type: 'item',
    key: '/node/search',
    title: {
      icon: 'mail',
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
  }
];