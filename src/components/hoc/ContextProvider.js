import React from 'react';
import { addLocaleData } from 'react-intl';
// Context
import AppContext from '../AppContext';
// APIs
import localeApi, { LOCALE_STORAGE_NAME } from '../../api/locale';
import { getUser, login as logUserIn, logout as logUserOut } from '../auth/user';
import { getContactTypes, getCountries, getIdTypes, getInstallationTypes, getLanguages, getVocabularyLanguages, getLicenses } from '../../api/enumeration';
// Languages
import { languages } from '../App';

// Initializing and exporting AppContext - common for whole application
// export const AppContext = React.createContext({});

/**
 * This is a State of application
 *
 * Here you can find:
 * - countries: a list of countries CODES requested from /enumeration/basic/Country
 * - userTypes: a list of user types to create a new Contact requested from /enumeration/basic/ContactType
 * - licenses: a list of licenses requested from /enumeration/license
 * - languages: a list of languages CODES requested from /enumeration/basic/Language
 * - installationTypes: a list of installation types requested from /enumeration/basic/InstallationType
 * - user: active user requested after login or whoAmI requests
 * - notifications: success/info/error messages from all over the app to provide them later for Notification component
 * - locale: current localization key:value pairs requested from the JSON files located in a public folder
 * - syncInstallationTypes: list of types of installation for which user can invoke Synchronization
 */
class ContextProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: [],
      userTypes: [],
      licenses: [],
      languages: [],
      vocabularyLanguages: [],
      installationTypes: [],
      user: null,
      notifications: [],
      locale: { locale: 'en', loading: true },
      isRTL: false,
      syncInstallationTypes: [
        'DIGIR_INSTALLATION',
        'TAPIR_INSTALLATION',
        'BIOCASE_INSTALLATION'
      ],
      // Adding errors to the list to provide them later for displaying
      addError: ({ status = 500, statusText = 'An error occurred' } = {}) => {
        this.setState(state => {
          return {
            notifications: [...state.notifications, { type: 'error', status, statusText }]
          };
        });
      },
      // Adding success messages to the list to provide them later for displaying
      addSuccess: ({ status = 200, statusText = 'Response successful' } = {}) => {
        this.setState(state => {
          return {
            notifications: [...state.notifications, { type: 'success', status, statusText }]
          };
        });
      },
      // Adding info messages to the list to provide them later for displaying
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
      changeLocale: this.changeLocale,
      login: this.login,
      logout: this.logout,
      loadActiveUser: this.loadActiveUser
    };
  }

  async componentDidMount() {
    // Requesting user by token to restore active session on App load
    // if a user was authenticated
    this._isMount = true;
    this.loadActiveUser();

    // Requesting common dictionaries
    const [countries, idTypes, userTypes, licenses, languages, vocabularyLanguages, installationTypes] = await Promise.all([
      getCountries(),
      getIdTypes(),
      getContactTypes(),
      getLicenses(),
      getLanguages(),
      getVocabularyLanguages(),
      getInstallationTypes()
    ]);

    if (this._isMount) {
      this.setState({
        countries,
        idTypes,
        userTypes,
        licenses,
        installationTypes,
        languages: languages.filter(language => language),
        vocabularyLanguages
      });
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  changeLocale = async locale => {
    if (locale) {
      this.setState(state => {
        return {
          locale: { ...state.locale, loading: true },
          isRTL: localeApi.isRtlLocale(locale)
        };
      });
      localStorage.setItem(LOCALE_STORAGE_NAME, locale);
      try {
        // Loading locale files for React Intl
        if (locale !== 'en' && languages.hasOwnProperty(locale)) {
          const localeDate = (await languages[locale]).default;
          addLocaleData(localeDate);
        }
        // Requesting new localization
        const res = await localeApi.getMessages(locale);
        this.setState({ locale: { locale, messages: res.data, loading: false } });
      } catch (e) {
        this.state.addError({
          status: 500,
          statusText: 'Unfortunately, localization was not found, loading English as default'
        });
        // Loading default locale to allow user to work with console anyway
        await this.changeLocale('en');
      }
    }
  };

  login = ({ userName, password }) => {
    return logUserIn(userName, password)
      .then(user => {
        this.setState({ user });
      });
  };

  logout = () => {
    logUserOut();
    this.setState({ user: null });
  };

  loadActiveUser = () => {
    getUser()
      .then(user => {
        if (this._isMount) {
          this.setState({ user: user }); // user may be undefined
        }
      })
      .catch(err => {
        this.state.addError(err.response);
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