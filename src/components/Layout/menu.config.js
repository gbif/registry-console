import { ShareAltOutlined, TableOutlined, ClusterOutlined, HddOutlined, GoldOutlined, BankOutlined, ForkOutlined, UserOutlined, BookOutlined, EditOutlined, EyeOutlined} from '@ant-design/icons'
const menuConfig = [
  {
    type: 'item',
    key: '/organization/search',
    title: {
      icon: <ShareAltOutlined />,
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
      icon: <TableOutlined />,
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
      icon: <ClusterOutlined />,
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
      icon: <HddOutlined />,
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
      icon: <GoldOutlined />,
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
      icon: <BankOutlined />,
      message: {
        id: 'menu.institution',
        default: 'Institutions'
      }
    }
  },
  // { // removed as per https://github.com/gbif/registry-console/issues/420
  //   type: 'item',
  //   key: '/person/search',
  //   title: {
  //     icon: 'team',
  //     message: {
  //       id: 'menu.grSciCollPerson',
  //       default: 'GrSciColl staff'
  //     }
  //   }
  // },
  {
    type: 'item',
    key: '/node/search',
    title: {
      icon: <ForkOutlined />,
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
      icon: <UserOutlined />,
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
      icon: <BookOutlined />,
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
      icon: <EditOutlined />,
      message: {
        id: 'menu.changes',
        default: 'Suggested changes'
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
      },
      {
        type: 'item',
        key: '/suggestions/collections/descriptors?status=PENDING',
        title: {
          message: {
            id: 'menu.suggestions.descriptors',
            default: 'Collection descriptors'
          }
        }
      }
    ]
  },
  {
    type: 'submenu',
    key: 'monitoring',
    title: {
      icon: <EyeOutlined />,
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
        key: '/monitoring/running-downloads',
        title: {
          message: {
            id: 'menu.monitoring.downloads',
            default: 'Running downloads'
          }
        },
        roles: ['REGISTRY_ADMIN']
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
export default menuConfig;