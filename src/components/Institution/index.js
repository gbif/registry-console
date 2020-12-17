import React, { Component, useState, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

// APIs
import {
  getInstitutionOverview,
  getInstitution,
  addContact,
  deleteContact,
  createIdentifier,
  deleteIdentifier,
  createTag,
  deleteTag,
  createMachineTag,
  deleteMachineTag,
} from '../../api/institution';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';
// Components
import { CreationFeedback, ItemHeader, ItemMenu } from '../common';
import InstitutionDetails from './Details';
import { PersonList, IdentifierList, TagList, MachineTagList } from '../common/subtypes';
import Exception404 from '../exception/404';
import { Collections } from './institutionSubtypes';
import Actions from './institution.actions';
import { roles } from '../auth/enums';

// Helpers
import { getSubMenu } from '../util/helpers';

class Institution extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      institution: null,
      counts: {},
      status: 200,
      isNew: false
    };
  }

  componentDidMount() {
    this.checkRouterState();
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    if (this.props.match.params.key) {
      this.getData();
    } else {
      this.setState({
        institution: null,
        loading: false
      });
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
  }

  getData() {
    this.setState({ loading: true });

    getInstitutionOverview(this.props.match.params.key).then(data => {
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        this.setState({
          institution: data.institution,
          loading: false,
          counts: {
            contacts: data.institution.contacts.length,
            identifiers: data.institution.identifiers.length,
            tags: data.institution.tags.length,
            machineTags: data.institution.machineTags.length,
            collections: data.collections.count
          }
        });
      }
    }).catch(error => {
      // Important for us due to the case of requests cancellation on unmount
      // Because in that case the request will be marked as cancelled=failed
      // and catch statement will try to update a state of unmounted component
      // which will throw an exception
      if (this._isMount) {
        this.setState({ status: error.response.status, loading: false });
        if (![404, 500, 523].includes(error.response.status)) {
          this.props.addError({ status: error.response.status, statusText: error.response.data });
        }
      }
    });
  }

  refresh = key => {
    if (key) {
      this.props.history.push(key, { isNew: true });
    } else {
      this.getData();
    }
  };

  updateCounts = (key, value) => {
    this.setState(state => {
      return {
        counts: {
          ...state.counts,
          [key]: value
        }
      };
    });
  };

  update(error) {
    // If component was unmounted interrupting changes
    if (!this._isMount) {
      return;
    }

    if (error) {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
      return;
    }

    this.getData();
  }

  checkRouterState() {
    const { history } = this.props;
    // If we set router state previously, we'll update component's state and reset router's state
    if (history.location && history.location.state && history.location.state.isNew) {
      this.setState({ isNew: true });
      const state = { ...history.location.state };
      delete state.isNew;
      history.replace({ ...history.location, state });
    }
  }

  getTitle = () => {
    const { intl } = this.props;
    const { institution, loading } = this.state;

    if (institution) {
      return institution.name;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newInstitution', defaultMessage: 'New institution' });
    }

    return '';
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { institution, loading, counts, status, isNew } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'institutions', defaultMessage: 'Institutions' });
    const submenu = getSubMenu(this.props);
    const pageTitle = institution || loading ?
      intl.formatMessage({ id: 'title.institution', defaultMessage: 'Institution | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newInstitution', defaultMessage: 'New institution | GBIF Registry' });
    const title = this.getTitle();

    return (
      <React.Fragment>
        <ItemHeader
          listType={[listName]}
          title={title}
          submenu={submenu}
          pageTitle={pageTitle}
          status={status}
          loading={loading}
          usePaperWidth
        >
          {institution && (
            <Actions institution={institution} onChange={error => this.update(error)}/>
          )}
        </ItemHeader>

        {isNew && !loading && (
          <CreationFeedback
            title={<FormattedMessage
              id="beenCreated.institution.title"
              defaultMessage="Institution has been created successfully!"
            />}
          />
        )}

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={institution === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <InstitutionDetails
                    institution={institution}
                    refresh={key => this.refresh(key)}
                  />
                }/>

                <Route path={`${match.path}/contact`} render={() =>
                  <PersonList
                    persons={institution.contacts}
                    permissions={{roles: [roles.GRSCICOLL_ADMIN]}}
                    addPerson={data => addContact(key, data)}
                    deletePerson={itemKey => deleteContact(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    identifiers={institution.identifiers}
                    permissions={{roles: [roles.REGISTRY_ADMIN]}}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    tags={institution.tags}
                    permissions={{roles: [roles.REGISTRY_ADMIN]}}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    machineTags={institution.machineTags}
                    permissions={{roles: [roles.GRSCICOLL_ADMIN]}}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route path={`${match.path}/collection`} render={() =>
                  <Collections institutionKey={match.params.key}/>
                }/>

                <Route component={Exception404}/>
              </Switch>
            </ItemMenu>
          )}
          />
        </PageWrapper>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Institution)));

export function InstitutionLink({uuid, ...props}) {
  const [institution, setInstitution] = useState(uuid);

  useEffect(() => {
    const fetchData = async () => {
        const response = await getInstitution(uuid);
        setInstitution(response.data);
    };

   fetchData();
  }, [uuid])

  return <a href={`/institution/${uuid}`} {...props}>{institution.name || uuid}</a>
}