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
    key: '/network/search',
    title: {
      icon: 'cluster',
      message: {
        id: 'menu.network',
        default: 'Networks'
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
    type: 'item',
    key: '/person/search',
    title: {
      icon: 'team',
      message: {
        id: 'menu.grSciCollPerson',
        default: 'GrSciColl staff'
      }
    }
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
    key: '/user',
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
    type: 'item',
    key: '/vocabulary/search',
    title: {
      icon: 'book',
      message: {
        id: 'menu.vocabulary',
        default: 'Vocabularies'
      }
    },
    // roles: ['VOCABULARY_ADMIN']
  },
  {
    type: 'submenu',
    key: 'changes',
    title: {
      icon: 'edit',
      message: {
        id: 'menu.changes',
        default: 'Change suggestions'
      }
    },
    children: [
      {
        type: 'item',
        key: '/suggestions/institutions?status=PENDING',
        title: {
          message: {
            id: 'menu.suggestions.institutions',
            default: 'Institution'
          }
        }
      },
      {
        type: 'item',
        key: '/suggestions/collections?status=PENDING',
        title: {
          message: {
            id: 'menu.suggestions.collections',
            default: 'Collections'
          }
        }
      }
    ]
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
        key: '/monitoring/running-crawls',
        title: {
          message: {
            id: 'menu.monitoring.ingestion',
            default: 'Crawling monitor'
          }
        }
      },
      {
        type: 'item',
        key: '/monitoring/running-ingestions',
        title: {
          message: {
            id: 'menu.monitoring.pipelineIngestion',
            default: 'Running ingestions'
          }
        }
      },
      {
        type: 'item',
        key: '/monitoring/ingestion-history',
        title: {
          message: {
            id: 'menu.monitoring.pipelineHistory',
            default: 'Ingestion history'
          }
        }
      },
      // removed per request https://github.com/gbif/registry-console/issues/331#issuecomment-604927815
      // {
      //   type: 'item',
      //   key: '/monitoring/overingested',
      //   title: {
      //     message: {
      //       id: 'menu.monitoring.overingested',
      //       default: 'Overingested datasets'
      //     }
      //   }
      // }
    ]
  }
];