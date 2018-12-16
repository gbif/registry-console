import React from 'react';

import { getContactTypes, getCountries, getInstallationTypes, getLanguages, getLicenses } from '../../api/enumeration';

export const AppContext = React.createContext({});

class ContextProvider extends React.Component {
  state = {
    countries: [],
    userTypes: [],
    licenses: [],
    languages: [],
    installationTypes: [],
    activeItem: null,
    user: null,
    errors: [],
    setItem: item => {
      this.setState({ activeItem: item });
    },
    addError: ({ status = 500, statusText = 'An error occurred' } = {}) => {
      this.setState(state => {
        return {
          errors: [...state.errors, { status, statusText }]
        }
      });
    },
    clearErrors: () => {
      this.setState({ errors: [] });
    }
  };

  async componentDidMount() {
    // TODO use Promise.all
    // TODO move locale and user request here too
    // TODO Probably, user request should be first one
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

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default ContextProvider;