import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Alert, Modal, Input } from 'antd';
import _keyBy from 'lodash/keyBy';
import config from '../../api/util/config';

// APIs
import {
  getInstitutionOverview,
  createContact,
  updateContact,
  deleteContact,
  createIdentifier,
  deleteIdentifier,
  createTag,
  deleteTag,
  createMachineTag,
  deleteMachineTag,
  deleteComment,
  createComment,
  suggestUpdateInstitution,
  createMasterSource,
  deleteMasterSource
} from '../../api/institution';
import { canCreate, canDelete, canUpdate } from '../../api/permissions';
import { getInstitutionMasterSourceFields } from '../../api/enumeration';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import { AuthRoute } from '../auth';
import withContext from '../hoc/withContext';
import PageWrapper from '../hoc/PageWrapper';
// Components
import { CreationFeedback, ItemHeader, ItemMenu } from '../common';
import InstitutionDetails from './Details';
import { CommentList, ContactPersonList, IdentifierList, TagList, MachineTagList, MasterSource } from '../common/subtypes';
import Exception404 from '../exception/404';
import { Collections } from './institutionSubtypes';
import Actions from './institution.actions';
import { roles } from '../auth/enums';

// Helpers
import { getSubMenu } from '../util/helpers';

const { TextArea } = Input;

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

  async componentDidMount() {
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

    const masterSourceFields = await getInstitutionMasterSourceFields();
    masterSourceFields.forEach(x => {
      x.sourceMap = _keyBy(x.sources, 'masterSource');
    });
    const masterSourceFieldMap = _keyBy(masterSourceFields, 'fieldName');
    this.setState({ masterSourceFields: masterSourceFieldMap });
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
        // get this records master source
        const masterSource = data.institution.masterSourceMetadata;
        let masterSourceLink;
        if (masterSource) {
          if (masterSource.source === 'IH_IRN') {
            masterSourceLink = `http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${masterSource.sourceId}`;
          } else if (masterSource.source === 'DATASET') {
            masterSourceLink = `${config.gbifUrl}/dataset/${masterSource.sourceId}`;
          } else if (masterSource.source === 'ORGANIZATION') {
            masterSourceLink = `${config.gbifUrl}/publisher/${masterSource.sourceId}`;
          }
        }

        // check if this record is linked to iDigBio
        const idigbioMachineTag = data.institution.machineTags.find(x => x.namespace === 'iDigBio.org');
        this.setState({
          institution: data.institution,
          loading: false,
          hasIdigbioLink: idigbioMachineTag ? true : false,
          masterSourceLink,
          masterSource,
          counts: {
            contacts: data.institution.contactPersons.length,
            identifiers: data.institution.identifiers.length,
            tags: data.institution.tags.length,
            machineTags: data.institution.machineTags.length,
            collections: data.collections.count,
            suggestions: data.pendingSuggestions.results.length
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

  showSuggestConfirm = ({ title, action }) => {
    // const { intl, user } = this.props;
    // const description = intl.formatMessage({ id: 'collection.merge.comment', defaultMessage: 'This collection will be deleted after merging.' });
    // const mergeLabel = intl.formatMessage({ id: 'merge', defaultMessage: 'Merge' });
    // const cancelLabel = intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' });
    Modal.confirm({
      title,
      okText: 'Send suggestion',
      okType: 'primary',
      cancelText: 'Cancel',
      content: <div>
        <Input onChange={e => this.setState({ proposerEmail: e.target.value })} type="text" defaultValue={this.state.proposerEmail} placeholder="email" style={{ marginBottom: 12 }}></Input>
        <TextArea onChange={e => this.setState({ suggestComment: e.target.value })} type="text" placeholder="comment"></TextArea>
      </div>,
      onOk: action
    });
  };

  suggestContacts = ({ contactPersons }) => {
    this.showSuggestConfirm({
      title: this.props.intl.formatMessage({ id: "suggestion.pleaseProvideEmailAndComment", defaultMessage: 'You are about to leave a suggestion, please provide your email and a comment' }),
      action: () => {
        suggestUpdateInstitution({
          comments: [this.state.suggestComment],
          proposerEmail: this.state.proposerEmail,
          body: {
            ...this.state.institution,
            contactPersons
          },
        })
          .then(() => {
            this.props.addSuccess({ statusText: <FormattedMessage id="suggestion.suggestionLogged" defaultMessage="Thank you. Your suggestion has been logged" /> });
            this.getData();
          })
          .catch(error => {
            debugger;
            this.props.addError({ status: error.response.status, statusText: error.response.data });
          })
      }
    });
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { institution, loading, counts, status, isNew, masterSource, masterSourceFields, masterSourceLink } = this.state;

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
            <Actions collectionCount={counts.collections} institution={institution} onChange={error => this.update(error)} />
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

        {masterSourceLink && masterSource.source === 'ORGANIZATION' && <Alert
          style={{ margin: '12px 0' }}
          message={<>
            <FormattedMessage
              id="masterSource.info.organization"
              defaultMessage="This record synchronises with {ORGANIZATION} and only some edits can be applied here, unless the master source is removed."
              values={{
                ORGANIZATION: <a href={masterSourceLink}>
                  <FormattedMessage id="masterSource.info.organization.linkText" defaultMessage="this publisher" />
                </a>
              }}
            />
          </>}
          type="warning"
        />}

        {masterSourceLink && this.state.masterSource.source === 'IH_IRN' && <Alert
          style={{ margin: '12px 0' }}
          message={<>
            <FormattedMessage
              id="masterSource.info.ih"
              defaultMessage="This record synchronises with {IH} and only some edits can be applied here, unless the master source is removed."
              values={{
                IH: <a href={masterSourceLink}>
                  <FormattedMessage id="masterSource.info.ih.linkText" defaultMessage="Index Herbariorum" />
                </a>
              }}
            />
          </>}
          type="warning"
        />}

        <PageWrapper status={status} loading={loading}>
          <Route path="/:type?/:key?/:section?" render={() => (
            <ItemMenu counts={counts} config={MenuConfig} isNew={institution === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <InstitutionDetails
                    masterSourceFields={masterSourceFields}
                    masterSource={masterSource}
                    institution={institution}
                    refresh={key => this.refresh(key)}
                  />
                } />

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactPersonList
                    contacts={institution.contactPersons}
                    permissions={{ roles: [roles.GRSCICOLL_ADMIN] }}
                    createContact={itemKey => createContact(key, itemKey)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={data => deleteContact(key, data)}
                    canCreate={() => canCreate('grscicoll/institution', key, 'contactPerson')}
                    canDelete={itemKey => canDelete('grscicoll/institution', key, 'contactPerson', itemKey)}
                    canUpdate={itemKey => canUpdate('grscicoll/institution', key, 'contactPerson', itemKey)}
                    updateCounts={this.updateCounts}
                    refresh={this.refresh}
                    suggestContacts={this.suggestContacts}
                  />
                } />

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    identifiers={institution.identifiers}
                    permissions={{ roles: [roles.REGISTRY_ADMIN] }}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    canCreate={() => canCreate('grscicoll/institution', key, 'identifier')}
                    canDelete={itemKey => canDelete('grscicoll/institution', key, 'identifier', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    tags={institution.tags}
                    permissions={{ roles: [roles.REGISTRY_ADMIN] }}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    canCreate={() => canCreate('grscicoll/institution', key, 'tag')}
                    canDelete={itemKey => canDelete('grscicoll/institution', key, 'tag', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    machineTags={institution.machineTags}
                    permissions={{ roles: [roles.GRSCICOLL_ADMIN] }}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    canCreate={() => canCreate('grscicoll/institution', key, 'machineTag')}
                    canDelete={itemKey => canDelete('grscicoll/institution', key, 'machineTag', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <AuthRoute
                  path={`${match.path}/comment`}
                  component={() =>
                    <CommentList
                      comments={institution.comments}
                      uuids={[]}
                      createComment={data => createComment(key, data)}
                      deleteComment={itemKey => deleteComment(key, itemKey)}
                      canCreate={() => canCreate('grscicoll/institution', key, 'comment')}
                      canDelete={itemKey => canDelete('grscicoll/institution', key, 'comment', itemKey)}
                      updateCounts={this.updateCounts}
                    />
                  }
                  roles={['REGISTRY_ADMIN', 'GRSCICOLL_ADMIN', 'GRSCICOLL_EDITOR']}
                />

                <Route path={`${match.path}/collection`} render={() =>
                  <Collections institutionKey={match.params.key} />
                } />

                <Route path={`${match.path}/master-source`} render={() =>
                  <MasterSource
                    entity={institution}
                    createMasterSource={data => createMasterSource(key, data)}
                    deleteMasterSource={() => deleteMasterSource(key)}
                    canCreate={() => canCreate('grscicoll/collection', key, 'masterSourceMetadata')}
                    canDelete={() => canDelete('grscicoll/collection', key, 'masterSourceMetadata')}
                    updateCounts={this.updateCounts}
                    refresh={this.refresh}
                  />
                } />

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

const mapContextToProps = ({ addError, addSuccess }) => ({ addError, addSuccess });

export default withContext(mapContextToProps)(withRouter(injectIntl(Institution)));