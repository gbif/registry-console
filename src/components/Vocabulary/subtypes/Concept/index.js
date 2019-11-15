import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Route, Switch, withRouter, NavLink } from "react-router-dom";

// APIs
import {
  getVocabulary,
  updateVocabulary,
  getConcept,
  createConcept,
  deprecateConcept
} from "../../../../api/vocabulary";
// Wrappers
import { AuthRoute } from "../../../auth";
import { roles } from "../../../auth/enums";
import Exception404 from "../../../exception/404";
import PageWrapper from "../../../hoc/PageWrapper";
import withContext from "../../../hoc/withContext";
// Configuration
import MenuConfig from "./menu.config";
// Components
import ConceptDetails from "./Details";
import { CreationFeedback, ItemHeader, ItemMenu } from "../../../common";
import ItemList from "../../subtypes/Item/ItemList";
import ItemMap from "../../subtypes/Item/ItemMap";
import {Breadcrumb} from "antd";

import ConceptList from "../../subtypes/ConceptList";
import Actions from "./concept.actions";
// Helpers
import { getSubMenu } from "../../../util/helpers";

class Concept extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      concept: null,
      externalDefinitions: [],
      editorialNotes: [],
      definition: {},
      label: {},
      counts: {},
      status: 200,
      isNew: false
    };
  }

  componentDidMount() {
    this.checkRouterState();
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    const {
      match: {
        params: { vocabularyName, conceptName }
      }
    } = this.props;
    if (vocabularyName && conceptName) {
      this.getData();
    } else {
      this.setState({
        data: null,
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
    const {
      match: {
        params: { vocabularyName, conceptName }
      }
    } = this.props;
    getConcept(vocabularyName, conceptName)
      .then(({ data }) => {
        // If user lives the page, request will return result anyway and tries to set in to a state
        // which will cause an error
        if (this._isMount) {
          this.setState({
            concept: data,
            loading: false,
            externalDefinitions: data.externalDefinitions || [],
            editorialNotes: data.editorialNotes || [],
            label: data.label || {},
            definition: data.definition || {},
            counts: {
              externalDefinitions: data.externalDefinitions
                ? data.externalDefinitions.length
                : 0,
              editorialNotes: data.editorialNotes
                ? data.editorialNotes.length
                : 0,
              label: data.label ? Object.keys(data.label).length : 0,
              definition: data.definition
                ? Object.keys(data.definition).length
                : 0
            }
          });
        }
      })
      .catch(err => {
        // Important for us due to the case of requests cancellation on unmount
        // Because in that case the request will be marked as cancelled=failed
        // and catch statement will try to update a state of unmounted component
        // which will throw an exception
        if (this._isMount) {
          this.setState({ status: err.response.status, loading: false });
          if (![404, 500, 523].includes(err.response.status)) {
            this.props.addError({
              status: err.response.status,
              statusText: err.response.data
            });
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
      this.props.addError({
        status: error.response.status,
        statusText: error.response.data
      });
      return;
    }

    this.getData();
  }

  checkRouterState() {
    const { history } = this.props;
    // If we set router state previously, we'll update component's state and reset router's state
    if (
      history.location &&
      history.location.state &&
      history.location.state.isNew
    ) {
      this.setState({ isNew: true });
      const state = { ...history.location.state };
      delete state.isNew;
      history.replace({ ...history.location, state });
    }
  }

  getTitle = () => {
    const { intl } = this.props;
    const { concept, loading } = this.state;

    if (concept) {
      return concept.name;
    } else if (!loading) {
      return intl.formatMessage({
        id: "newConcept",
        defaultMessage: "New concept"
      });
    }

    return "";
  };

  addConcept(vocabularyName, concept) {
    createConcept(vocabularyName, concept)
      .then(() => {
        this.updateConcepts(1);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: "beenAdded.concept",
            defaultMessage: "Concept has been added"
          })
        });
      })
      .catch(error => {
        this.props.addError({
          status: error.response.status,
          statusText: error.response.data
        });
      });
  }

  deprecateVocabularyConcept(vocabularyName, concept) {
    deprecateConcept(vocabularyName, concept)
      .then(() => {
        this.updateConcepts(-1);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: "beenDeprecated.concept",
            defaultMessage: "Concept has been deprecated"
          })
        });
      })
      .catch(error => {
        this.props.addError({
          status: error.response.status,
          statusText: error.response.data
        });
      });
  }

  updateConcepts = direction => {
    this.setState(state => {
      return {
        constituentKey: Date.now(), // If we generate a new key for the child component, React will rerender it
        counts: {
          ...state.counts,
          concepts: state.counts.concepts + direction
        }
      };
    });
  };

  createListItem = (value, itemType) => {
    const { vocabulary, counts } = this.state;

    return updateVocabulary({
      ...vocabulary,
      [itemType]: vocabulary[itemType]
        ? [value, ...vocabulary[itemType]]
        : [value]
    })
      .then(res =>
        this.setState({
          vocabulary: res.data,
          [itemType]: res.data[itemType],
          counts: { ...counts, [itemType]: res.data[itemType].length }
        })
      )
      .catch(err => {
        console.log(err);
      });
  };
  createMapItem = (data, itemType) => {
    const { vocabulary, counts } = this.state;
    const { key, value } = data;
    return updateVocabulary({
      ...vocabulary,
      [itemType]: vocabulary[itemType]
        ? { ...vocabulary[itemType], [key]: value }
        : { [key]: value }
    })
      .then(res =>
        this.setState({
          vocabulary: res.data,
          [itemType]: res.data[itemType],
          counts: {
            ...counts,
            [itemType]: res.data[itemType]
              ? Object.keys(res.data[itemType]).length
              : 0
          }
        })
      )
      .catch(err => {
        console.log(err);
      });
  };

  deleteListItem = (key, itemType) => {
    const { vocabulary, counts } = this.state;
    return updateVocabulary({
      ...vocabulary,
      [itemType]: vocabulary[itemType]
        .slice(0, key)
        .concat(
          vocabulary[itemType].slice(key + 1, vocabulary[itemType].length)
        )
    })
      .then(res =>
        this.setState({
          vocabulary: res.data,
          [itemType]: res.data[itemType],
          counts: { ...counts, [itemType]: res.data[itemType].length }
        })
      )
      .catch(err => {
        console.log(err);
      });
  };

  deleteMapItem = (key, itemType) => {
    const { vocabulary, counts } = this.state;

    let newMap = { ...vocabulary[itemType] };
    delete newMap[key];
    return updateVocabulary({
      ...vocabulary,
      [itemType]: newMap
    })
      .then(res =>
        this.setState({
          vocabulary: res.data,
          [itemType]: res.data[itemType],
          counts: {
            ...counts,
            [itemType]: Object.keys(res.data[itemType]).length
          }
        })
      )
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { match, intl } = this.props;
    const {match: {
        params: { vocabularyName, conceptName }
      }} = this.props;
    const key = match.params.key;
    const {
      concept,
      externalDefinitions,
      editorialNotes,
      label,
      definition,
      loading,
      counts,
      status,
      isNew
    } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({
      id: "vocabulary",
      defaultMessage: "Vocabulary"
    });
    const submenu = getSubMenu(this.props);
    const pageTitle =
      concept || loading
        ? intl.formatMessage({
            id: "title.concept",
            defaultMessage: "Concept | GBIF Registry"
          })
        : intl.formatMessage({
            id: "title.newConcept",
            defaultMessage: "New concept | GBIF Registry"
          });
    const title = this.getTitle();

    return (
      <React.Fragment>
        <ItemHeader
          breadCrumbs={
            <Breadcrumb style={{ display: "flex" }}>
              <Breadcrumb.Item>
                {intl.formatMessage({
                  id: "vocabulary",
                  defaultMessage: "Vocabulary"
                })}
              </Breadcrumb.Item>
              <Breadcrumb.Item>
              <NavLink
          to={{
            pathname: `/vocabulary/${vocabularyName}`
          }}
          exact={true}
        >{vocabularyName}</NavLink>
              
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {intl.formatMessage({
                  id: "concept",
                  defaultMessage: "Concept"
                })}
              </Breadcrumb.Item>
              <Breadcrumb.Item>{conceptName}</Breadcrumb.Item>
            </Breadcrumb>
          }
          listType={[listName]}
          title={title}
          submenu={submenu}
          pageTitle={pageTitle}
          status={status}
          loading={loading}
          usePaperWidth
        >
          {concept && (
            <Actions concept={concept} onChange={error => this.update(error)} />
          )}
        </ItemHeader>

        {isNew && !loading && (
          <CreationFeedback
            title={
              <FormattedMessage
                id="beenCreated.vocabulary.name"
                defaultMessage="Vocabulary has been created successfully!"
              />
            }
          />
        )}

        <PageWrapper status={status} loading={loading}>
          <Route
            path="/:type?/:key?/:section?"
            render={() => (
              <ItemMenu
                counts={counts}
                config={MenuConfig}
                isNew={concept === null}
              >
                <Switch>
                  <Route
                    exact
                    path={`${match.path}`}
                    render={() => (
                      <ConceptDetails
                        concept={concept}
                        refresh={key => this.refresh(key)}
                      />
                    )}
                  />

                  <Route
                    path={`${match.path}/editorialNotes`}
                    component={() => (
                      <ItemList
                        itemName="editorialNotes"
                        items={editorialNotes.map((n, index) => ({
                          key: index,
                          value: n
                        }))}
                        createItem={data =>
                          this.createListItem(data.value, "editorialNotes")
                        }
                        deleteItem={itemKey =>
                          this.deleteListItem(itemKey, "editorialNotes")
                        }
                        updateCounts={this.updateCounts}
                        permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
                      />
                    )}
                  />
                  {/*                 <ItemList
                      itemName="externalDefinitions"
                      items={externalDefinitions}
                      createItem={
                        data => this.createListItem(data.value, 'externalDefinitions')}
                      deleteItem={
                        itemKey => this.deleteListItem(itemKey, 'externalDefinitions')}
                      updateCounts={this.updateCounts}
                      permissions={{roles: [roles.VOCABULARY_ADMIN]}}
                    /> */}
                  <Route
                    path={`${match.path}/externalDefinitions`}
                    component={() => (
                      <ItemList
                        itemName="externalDefinitions"
                        items={externalDefinitions.map((n, index) => ({
                          key: index,
                          value: n
                        }))}
                        createItem={data =>
                          this.createListItem(data.value, "externalDefinitions")
                        }
                        deleteItem={itemKey =>
                          this.deleteListItem(itemKey, "externalDefinitions")
                        }
                        updateCounts={this.updateCounts}
                        permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
                      />
                    )}
                  />
                  <Route
                    path={`${match.path}/definition`}
                    component={() => (
                      <ItemMap
                        itemName="definition"
                        items={Object.keys(definition).map(key => ({
                          key: key,
                          value: definition[key]
                        }))}
                        createItem={data =>
                          this.createMapItem(data, "definition")
                        }
                        deleteItem={itemKey =>
                          this.deleteMapItem(itemKey, "definition")
                        }
                        updateCounts={this.updateCounts}
                        permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
                      />
                    )}
                  />
                  <Route
                    path={`${match.path}/label`}
                    component={() => (
                      <ItemMap
                        itemName="label"
                        items={Object.keys(label).map(key => ({
                          key: key,
                          value: label[key]
                        }))}
                        createItem={data => this.createMapItem(data, "label")}
                        deleteItem={itemKey =>
                          this.deleteMapItem(itemKey, "label")
                        }
                        updateCounts={this.updateCounts}
                        permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
                      />
                    )}
                  />
                  {/* 
                  <Route
                    path={`${match.path}/concepts`}
                    render={() => (
                      <ConceptList
                        parent={concept}
                        vocabulary={vocabulary}
                        createConcept={(vocabulary, concept) =>
                          this.addConcept(vocabulary.name, concept)
                        }
                        deprecateConcept={(vocabulary, concept) =>
                          this.deprecateVocabularyConcept(
                            vocabulary.name,
                            concept
                          )
                        }
                        updateCounts={(key, value) =>
                          this.updateCounts(key, value)
                        }
                      />
                    )}
                  /> */}

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

const mapContextToProps = ({ addError, addSuccess }) => ({
  addError,
  addSuccess
});

export default withContext(mapContextToProps)(withRouter(injectIntl(Concept)));
