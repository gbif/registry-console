import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, Input, Alert } from "antd";
import _keyBy from 'lodash/keyBy';
import config from '../../api/util/config';

// APIs
import {
  getCollectionOverview,
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
  suggestUpdateCollection,
  createMasterSource,
  deleteMasterSource,
  createDescriptorGroup,
  deleteDescriptorGroup,
  updateDescriptorGroup,
} from '../../api/collection';
import { canCreate, canDelete, canUpdate } from '../../api/permissions';
import { getCollectionMasterSourceFields } from '../../api/enumeration';
// Configuration
import MenuConfig from './menu.config';
// Wrappers
import PageWrapper from '../hoc/PageWrapper';
import withContext from '../hoc/withContext';
// Components
import { ItemMenu, ItemHeader, CreationFeedback } from '../common';
import CollectionDetails from './Details';
import { CommentList, ContactPersonList, IdentifierList, TagList, MachineTagList, MasterSource } from '../common/subtypes';
import DescriptorGroups from './subtypes/DescriptorGroups';
import Exception404 from '../exception/404';
import Actions from './collection.actions';
// Helpers
import { getSubMenu } from '../util/helpers';
import { roles } from '../auth/enums';

const { TextArea } = Input;

class Collection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      collection: null,
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
        data: null,
        loading: false
      });
    }

    const masterSourceFields = await getCollectionMasterSourceFields();
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

    getCollectionOverview(this.props.match.params.key).then(data => {
      // If user lives the page, request will return result anyway and tries to set in to a state
      // which will cause an error
      if (this._isMount) {
        // get this records master source
        const masterSourceMetadata = data.masterSourceMetadata;
        let masterSourceLink;
        if (masterSourceMetadata) {
          if (masterSourceMetadata.source === 'IH_IRN') {
            masterSourceLink = `http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=${masterSourceMetadata.sourceId}`;
          } else if (masterSourceMetadata.source === 'DATASET') {
            masterSourceLink = `${config.gbifUrl}/dataset/${masterSourceMetadata.sourceId}`;
          } else if (masterSourceMetadata.name === 'ORGANIZATION') {
            masterSourceLink = `${config.gbifUrl}/publisher/${masterSourceMetadata.sourceId}`;
          }
        }

        // check if this record is linked to iDigBio
        const idigbioMachineTag = data.machineTags.find(x => x.namespace === 'iDigBio.org');
        const idigbioUUIDTag = data.machineTags.find(x => x.namespace === 'iDigBio.org' && x.name === 'CollectionUUID');

        this.setState({
          collection: data,
          loading: false,
          hasIdigbioLink: idigbioMachineTag ? true : false,
          idigbioUUID: idigbioUUIDTag ? idigbioUUIDTag.value.substr(9) : undefined,
          masterSourceLink,
          masterSourceMetadata: masterSourceMetadata,
          counts: {
            descriptorGroups: data.descriptorGroups.count,
            contacts: data.contactPersons.length,
            identifiers: data.identifiers.length,
            tags: data.tags.length,
            machineTags: data.machineTags.length,
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
      this.getData();
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
    const { collection, loading } = this.state;

    if (collection) {
      return collection.name;
    } else if (!loading) {
      return intl.formatMessage({ id: 'newCollection', defaultMessage: 'New collection' });
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
        suggestUpdateCollection({
          comments: [this.state.suggestComment],
          proposerEmail: this.state.proposerEmail,
          body: {
            ...this.state.collection,
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

  addDescriptor(collectionKey, descriptorGroup) {
    createDescriptorGroup(collectionKey, descriptorGroup).then(() => {
      this.updateDescriptors(1);
      this.getData();
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenAdded.descriptorGroup',
          defaultMessage: 'Descriptor group has been added'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  updateDescriptor(collectionKey, descriptorGroup) {
    updateDescriptorGroup(collectionKey, descriptorGroup).then(() => {
      this.updateDescriptors(0);
      this.getData();
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenUpdated.descriptorGroup',
          defaultMessage: 'Descriptor group has been updated'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  deleteDescriptor(collectionKey, descriptorGroupKey) {
    deleteDescriptorGroup(collectionKey, descriptorGroupKey).then(() => {
      this.updateDescriptors(-1);
      this.getData();
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.descriptorGroup',
          defaultMessage: 'Descriptor group has been deleted'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    })
  }

  updateDescriptors = direction => {
    this.setState(state => {
      return {
        collectionKey: Date.now(), // If we generate a new key for the child component, React will rerender it
        counts: {
          ...state.counts,
          descriptorGroups: state.counts.descriptorGroups + direction
        }
      };
    });
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { collection, loading, counts, status, isNew, masterSource, masterSourceMetadata, masterSourceLink, masterSourceFields } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({ id: 'collections', defaultMessage: 'Collections' });
    const submenu = getSubMenu(this.props);
    const pageTitle = collection || loading ?
      intl.formatMessage({ id: 'title.collection', defaultMessage: 'Collection | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newCollection', defaultMessage: 'New collection | GBIF Registry' });
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
          {collection && (
            <Actions collection={collection} onChange={error => this.update(error)} />
          )}
        </ItemHeader>

        {isNew && !loading && (
          <CreationFeedback
            title={<FormattedMessage
              id="beenCreated.collection.title"
              defaultMessage="Collection has been created successfully!"
            />}
          />
        )}

        {masterSourceLink && masterSourceMetadata.source === 'DATASET' && <Alert
          style={{ margin: '12px 0' }}
          message={<>
            <FormattedMessage
              id="masterSource.info.dataset"
              defaultMessage="This record synchronises with {DATASET} and only some edits can be applied here, unless the master source is removed."
              values={{
                DATASET: <a href={masterSourceLink}>
                  <FormattedMessage id="masterSource.info.dataset.linkText" defaultMessage="this dataset" />
                </a>
              }}
            />
          </>}
          type="warning"
        />}

        {masterSourceLink && masterSourceMetadata.source === 'IH_IRN' && <Alert
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
            <ItemMenu counts={counts} config={MenuConfig} isNew={collection === null}>
              <Switch>
                <Route exact path={`${match.path}`} render={() =>
                  <CollectionDetails
                    masterSourceFields={masterSourceFields}
                    masterSource={masterSource}
                    masterSourceLink={masterSourceLink}
                    collection={collection}
                    refresh={key => this.refresh(key)}
                  />
                } />

                <Route path={`${match.path}/descriptorGroup`} render={() =>
                  <DescriptorGroups
                    collection={collection}
                    addDescriptorGroup={(collectionKey, descriptorGroup) => this.addDescriptor(collectionKey, descriptorGroup)}
                    updateDescriptorGroup={(collectionKey, descriptorGroup) => this.updateDescriptor(collectionKey, descriptorGroup)}
                    deleteDescriptorGroup={(collectionKey, descriptorGroupKey) => this.deleteDescriptor(collectionKey, descriptorGroupKey)}
                    refresh={this.refresh}
                  />
                } />

                <Route path={`${match.path}/contact`} render={() =>
                  <ContactPersonList
                    contacts={collection.contactPersons}
                    permissions={{ roles: [roles.GRSCICOLL_ADMIN] }}
                    createContact={itemKey => createContact(key, itemKey)}
                    updateContact={data => updateContact(key, data)}
                    deleteContact={data => deleteContact(key, data)}
                    canCreate={() => canCreate('grscicoll/collection', key, 'contactPerson')}
                    canDelete={itemKey => canDelete('grscicoll/collection', key, 'contactPerson', itemKey)}
                    canUpdate={itemKey => canUpdate('grscicoll/collection', key, 'contactPerson', itemKey)}
                    updateCounts={this.updateCounts}
                    refresh={this.refresh}
                    suggestContacts={this.suggestContacts}
                  />
                } />

                <Route path={`${match.path}/identifier`} render={() =>
                  <IdentifierList
                    identifiers={collection.identifiers}
                    permissions={{ roles: [roles.GRSCICOLL_ADMIN] }}
                    createIdentifier={data => createIdentifier(key, data)}
                    deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                    canCreate={() => canCreate('grscicoll/collection', key, 'identifier')}
                    canDelete={itemKey => canDelete('grscicoll/collection', key, 'identifier', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/tag`} render={() =>
                  <TagList
                    tags={collection.tags}
                    permissions={{ roles: [roles.GRSCICOLL_ADMIN] }}
                    createTag={data => createTag(key, data)}
                    deleteTag={itemKey => deleteTag(key, itemKey)}
                    canCreate={() => canCreate('grscicoll/collection', key, 'tag')}
                    canDelete={itemKey => canDelete('grscicoll/collection', key, 'tag', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/machineTag`} render={() =>
                  <MachineTagList
                    machineTags={collection.machineTags}
                    permissions={{ roles: [roles.GRSCICOLL_ADMIN] }}
                    createMachineTag={data => createMachineTag(key, data)}
                    deleteMachineTag={itemKey => deleteMachineTag(key, itemKey)}
                    canCreate={() => canCreate('grscicoll/collection', key, 'machineTag')}
                    canDelete={itemKey => canDelete('grscicoll/collection', key, 'machineTag', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                } />

                <Route path={`${match.path}/comment`} render={() =>
                  <CommentList
                    comments={collection.comments}
                    uuids={[]}
                    createComment={data => createComment(key, data)}
                    deleteComment={itemKey => deleteComment(key, itemKey)}
                    canCreate={() => canCreate('grscicoll/collection', key, 'comment')}
                    canDelete={itemKey => canDelete('grscicoll/collection', key, 'comment', itemKey)}
                    updateCounts={this.updateCounts}
                  />
                }
                />

                <Route path={`${match.path}/master-source`} render={() =>
                  <MasterSource
                    entity={collection}
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

export default withContext(mapContextToProps)(withRouter(injectIntl(Collection)));