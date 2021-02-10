import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import _get from 'lodash/get';

// APIs
import {
  getPersonOverview,
  createIdentifier,
  deleteIdentifier,
  createTag,
  deleteTag,
  createMachineTag,
  deleteMachineTag,
} from '../../api/grscicollPerson';
import { canCreate, canDelete, } from '../../api/permissions';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';
// Components
import { CreationFeedback, ItemHeader, ItemMenu } from '../common';
import { IdentifierList, TagList, MachineTagList } from '../common/subtypes';
import PersonDetails from './Details';
import Exception404 from '../exception/404';
import { Collections, Institutions } from './personSubtypes';
import Actions from './person.actions';
// Helpers
import { getSubMenu } from '../util/helpers';
import { roles } from '../auth/enums';

class Person extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      person: null,
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
        person: null,
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

    getPersonOverview(this.props.match.params.key).then(data => {
      this.setState({
        person: data.person,
        counts: {
          collections: data.collections.count,
          institutions: data.institutions.count,
          identifiers: data.person.identifiers.length,
          tags: data.person.tags.length,
          machineTags: data.person.machineTags.length
        },
        loading: false
      });
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
    const { person, loading } = this.state;

    if (person) {
      return `${person.firstName} ${_get(person, 'lastName', '')}`;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newPerson', defaultMessage: 'New person' });
    }

    return '';
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { person, counts, loading, status, isNew } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'persons', defaultMessage: 'Persons' });
    const submenu = getSubMenu(this.props);
    const pageTitle = person || loading ?
      intl.formatMessage({ id: 'title.person', defaultMessage: 'Person | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newPerson', defaultMessage: 'New person | GBIF Registry' });
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
          {person && (
            <Actions person={person} onChange={error => this.update(error)} />
          )}
        </ItemHeader>

        {isNew && !loading && (
          <CreationFeedback
            title={<FormattedMessage
              id="beenCreated.person.title"
              defaultMessage="Person has been created successfully!"
            />}
          />
        )}

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={person === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <PersonDetails
                    person={person}
                    refresh={key => this.refresh(key)}
                  />
                } />

                <Route path={`${match.path}/collection`} render={() =>
                  <Collections personKey={key} />
                } />

                <Route path={`${match.path}/institution`} render={() =>
                  <Institutions personKey={key} />
                } />

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    identifiers={person.identifiers}
                    permissions={{ roles: [roles.GRSCICOLL_ADMIN] }}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    canCreate={() =>      canCreate('grscicoll/person', key, 'identifier')}
                    canDelete={itemKey => canDelete('grscicoll/person', key, 'identifier', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    tags={person.tags}
                    permissions={{ roles: [roles.GRSCICOLL_ADMIN] }}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    canCreate={() =>      canCreate('grscicoll/person', key, 'tag')}
                    canDelete={itemKey => canDelete('grscicoll/person', key, 'tag', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    machineTags={person.machineTags}
                    permissions={{roles: [roles.GRSCICOLL_ADMIN]}}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    canCreate={() =>      canCreate('grscicoll/person', key, 'machineTag')}
                    canDelete={itemKey => canDelete('grscicoll/person', key, 'machineTag', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }/>

                <Route component={Exception404} />
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

export default withContext(mapContextToProps)(withRouter(injectIntl(Person)));