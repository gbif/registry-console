import React from 'react';
import getDeep from 'lodash/get';

import localeApi, { LOCALE_STORAGE_NAME } from '../../api/locale';
import { whoAmI, login as logUserIn, logout as logUserOut, JWT_STORAGE_NAME } from '../../api/user';
import { getContactTypes, getCountries, getInstallationTypes, getLanguages, getLicenses } from '../../api/enumeration';
import { getUserItems } from '../../api/util/helpers';

export const AppContext = React.createContext({});

class ContextProvider extends React.Component {
  state = {
    countries: [],
    userTypes: [],
    licenses: [],
    languages: [],
    installationTypes: [],
    user: null,
    notifications: [],
    locale: { loading: true },
    syncInstallationTypes: [
      'DIGIR_INSTALLATION',
      'TAPIR_INSTALLATION',
      'BIOCASE_INSTALLATION'
    ],
    addError: ({ status = 500, statusText = 'An error occurred' } = {}) => {
      this.setState(state => {
        return {
          notifications: [...state.notifications, { type: 'error', status, statusText }]
        };
      });
    },
    addSuccess: ({ status = 200, statusText = 'Response successful' } = {}) => {
      this.setState(state => {
        return {
          notifications: [...state.notifications, { type: 'success', status, statusText }]
        };
      });
    },
    addInfo: ({ status = 200, statusText = 'Response successful' } = {}) => {
      this.setState(state => {
        return {
          notifications: [...state.notifications, { type: 'info', status, statusText }]
        };
      });
    },
    clearNotifications: () => {
      this.setState({ notifications: [] });
    },
    changeLocale: locale => {
      this.changeLocale(locale);
    },
    login: values => {
      return this.login(values);
    },
    loadTokenUser: () => {
      this.loadTokenUser();
    },
    logout: () => {
      this.logout();
    }
  };

  async componentDidMount() {
    // TODO use Promise.all
    const countries = await getCountries();
    const userTypes = await getContactTypes();
    const licenses = await getLicenses();
    const languages = await getLanguages();
    const installationTypes = await getInstallationTypes();

    this.setState({
      countries,
      userTypes,
      licenses,
      languages,
      installationTypes
    });
  }

  changeLocale = locale => {
    if (locale) {
      this.setState(state => {
        return {
          locale: { ...state.locale, loading: true }
        };
      });
      localStorage.setItem(LOCALE_STORAGE_NAME, locale);

      localeApi.getMessages(locale)
        .then(res => {
          this.setState({ locale: { locale, messages: res.data, loading: false } });
        })
        .catch(err => {
          this.state.addError(err.response);
        });
    }
  };

  login = ({ userName, password, remember }) => {
    return logUserIn(userName, password, remember)
      .then(res => {
        const user = res.data;
        const jwt = user.token;
        sessionStorage.setItem(JWT_STORAGE_NAME, jwt);
        if (remember) {
          localStorage.setItem(JWT_STORAGE_NAME, jwt);
        }
        this.setState({ user: { ...user, editorRoleScopeItems: [] } });
        this.getUserItems(user);
      });
  };

  logout = () => {
    logUserOut();
    this.setState({ user: null });
  };

  loadTokenUser = () => {
    const jwt = sessionStorage.getItem(JWT_STORAGE_NAME);
    if (jwt) {
      whoAmI().then(res => {
        this.setState({ user: { ...res.data, editorRoleScopeItems: [] } });
        this.getUserItems(res.data);
      })
        .catch(err => {
          const statusCode = getDeep(err, 'response.status', 500);
          if (statusCode < 500) {
            logUserOut();
            this.setState({ user: null });
            window.location.reload();
          } else {
            this.state.addError(err.response);
          }
        });
    }
  };

  /**
   * Requesting user items by keys from editorRoleScopes list
   * @param editorRoleScopes - list of UIDs which indicates users scope
   */
  getUserItems = ({ editorRoleScopes }) => {
    getUserItems(editorRoleScopes).then(response => {
      this.setState(state => {
        return {
          user: {
            ...state.user,
            editorRoleScopeItems: response
          }
        }
      });
    });
  };

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default ContextProvider;