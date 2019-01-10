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
            id: 'menu.organization.search',
            default: 'Search'
          }
        }
      },
      {
        type: 'item',
        key: '/organization/deleted',
        title: {
          message: {
            id: 'menu.organization.deleted',
            default: 'Deleted'
          }
        }
      },
      {
        type: 'item',
        key: '/organization/pending',
        title: {
          message: {
            id: 'menu.organization.pending',
            default: 'Pending'
          }
        }
      },
      {
        type: 'item',
        key: '/organization/nonPublishing',
        title: {
          message: {
            id: 'menu.organization.nonPublishing',
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
            id: 'menu.dataset.search',
            default: 'Search'
          }
        }
      },
      {
        type: 'item',
        key: '/dataset/deleted',
        title: {
          message: {
            id: 'menu.dataset.deleted',
            default: 'Deleted'
          }
        }
      },
      {
        type: 'item',
        key: '/dataset/duplicate',
        title: {
          message: {
            id: 'menu.dataset.duplicate',
            default: 'Duplicate'
          }
        }
      },
      {
        type: 'item',
        key: '/dataset/constituent',
        title: {
          message: {
            id: 'menu.dataset.constituent',
            default: 'Constituent'
          }
        }
      },
      {
        type: 'item',
        key: '/dataset/withNoEndpoint',
        title: {
          message: {
            id: 'menu.dataset.withNoEndpoint',
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
            id: 'menu.installation.installationNoDataset',
            default: 'Serving no datasets'
          }
        }
      }
    ]
  },
  {
    type: 'submenu',
    key: 'collection',
    title: {
      icon: 'hdd',
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
            default: 'Search'
          }
        }
      },
      // {
      //   type: 'item',
      //   key: '/collection/deleted',
      //   title: {
      //     message: {
      //       id: 'menu.collection.deleted',
      //       default: 'Deleted'
      //     }
      //   }
      // }
    ]
  },
  {
    type: 'submenu',
    key: 'institution',
    title: {
      icon: 'hdd',
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
            default: 'Search'
          }
        }
      },
      // {
      //   type: 'item',
      //   key: '/institution/deleted',
      //   title: {
      //     message: {
      //       id: 'menu.institution.deleted',
      //       default: 'Deleted'
      //     }
      //   }
      // }
    ]
  },
  {
    type: 'submenu',
    key: 'person',
    title: {
      icon: 'hdd',
      message: {
        id: 'menu.grbioPerson',
        default: 'GRBIO staff'
      }
    },
    children: [
      {
        type: 'item',
        key: '/person/search',
        title: {
          message: {
            id: 'menu.person.search',
            default: 'Search'
          }
        }
      },
      // {
      //   type: 'item',
      //   key: '/person/deleted',
      //   title: {
      //     message: {
      //       id: 'menu.person.deleted',
      //       default: 'Deleted'
      //     }
      //   }
      // }
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