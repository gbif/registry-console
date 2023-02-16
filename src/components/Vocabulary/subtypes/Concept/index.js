import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Route, Switch, withRouter, NavLink } from "react-router-dom";
import {ConfigProvider} from "antd"
// APIs
import {
  searchConcepts,
  getConcept,
  updateConcept,
  createConcept,
  deprecateConcept,
  addConceptLabel,
  deleteConceptLabel,
  addConceptDefinition,
  deleteConceptDefinition,
  getVocabulary
} from "../../../../api/vocabulary";
// Wrappers

import Exception404 from "../../../exception/404";
import PageWrapper from "../../../hoc/PageWrapper";
import withContext from "../../../hoc/withContext";
// Configuration
import MenuConfig from "./menu.config";
// Components
import LanguageSelect from "../../LanguageSelect"
import ConceptDetails from "./Details";
import { CreationFeedback, ItemHeader, ItemMenu } from "../../../common";

import { Breadcrumb } from "antd";

import ConceptList from "../../subtypes/ConceptList";
import Actions from "./concept.actions";
// Helpers
import { getSubMenu } from "../../../util/helpers";
import _ from "lodash";

class Concept extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      concept: null,
      availableLanguages: [],
      preferredLangues: [],
      externalDefinitions: [],
      editorialNotes: [],
      definition: {},
      label: {},
      counts: {},
      status: 200,
      isNew: false
    };
  }
  componentDidUpdate(prevProps) {
    if (
      _.get(this.props, "match.params.subTypeKey") !==
      _.get(prevProps, "match.params.subTypeKey")
    ) {
      this.getData();
    }
  }
  componentDidMount() {
    this.checkRouterState();
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    const {
      match: {
        params: { key: vocabularyName, subTypeKey: conceptName }
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

  getData = async () => {
    this.setState({ loading: true });
    const {
      match: {
        params: { key: vocabularyName, subTypeKey: conceptName }
      }
    } = this.props;

    try {
      const conceptReq = await getConcept(vocabularyName, conceptName);
      const { data } = conceptReq;
      const childrenReq = await searchConcepts(vocabularyName, {
        parentKey: data.key
      });
      const { data: children } = childrenReq;
      const vocabularyReq = await getVocabulary(vocabularyName);
      const { data: vocabulary } = vocabularyReq;
      if (this._isMount) {
        this.setState({
          concept: data,
          availableLanguages: data.label ? Object.keys(data.label): [],
          children: children,
          vocabulary: vocabulary,
          loading: false,
          externalDefinitions: data.externalDefinitions || [],
          editorialNotes: data.editorialNotes || [],
          label: data.label.map(({ language, value }) => ({ [language]: value })) || {},
          definition: data.definition.map(({ language, value }) => ({ [language]: value })) || {},
          counts: {
            children: children ? children.count : 0,
            externalDefinitions: data.externalDefinitions
              ? data.externalDefinitions.length
              : 0,
            editorialNotes: data.editorialNotes
              ? data.editorialNotes.length
              : 0,
            label: data.label ? data.label.length : 0,
            definition: data.definition ? data.definition.length : 0
          }
        });
      }
    } catch (err) {
      console.log(err);
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
    }
  };

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

  createConceptLabel = (labelData) => {
    const { vocabulary, concept, label, counts } = this.state;
    return addConceptLabel(vocabulary.name, concept.name, labelData)
      .then(res => {
        getConcept(vocabulary.name, concept.name).then(res => {
          this.setState({
            concept: res.data,
            label: res.data.label.map(({ language, value }) => ({ [language]: value })),
            counts: { ...counts, [label]: res.data.label.length }
          });
          this.props.addSuccess({
            status: 200,
            statusText: this.props.intl.formatMessage({
              // TODO: translations??
              id: "addedLabel.concept",
              defaultMessage: "Label added"
            })
          });
        });      
      })
  };

  deleteConceptLabel = (key) => {
    const { vocabulary, concept, label, counts } = this.state;
    return deleteConceptLabel(vocabulary.name, concept.name, key)
      .then(res => {
        getConcept(vocabulary.name, concept.name).then(res => {
          this.setState({
            concept: res.data,
            label: res.data.label.map(({ language, value }) => ({ [language]: value })),
            counts: { ...counts, [label]: res.data.label ? res.data.label.length : 0 }
          });
        });      
      })
  };

  createConceptDefinition = (definitionData) => {
    const { vocabulary, concept, definition, counts } = this.state;
    return addConceptDefinition(vocabulary.name, concept.name, definitionData)
      .then(res => {
        getConcept(vocabulary.name, concept.name).then(res => {
          this.setState({
            concept: res.data,
            definition: res.data.definition.map(({ language, value }) => ({ [language]: value })),
            counts: { ...counts, [definition]: res.data.definition.length }
          });
          this.props.addSuccess({
            status: 200,
            statusText: this.props.intl.formatMessage({
              // TODO: translations??
              id: "addedDefinition.concept",
              defaultMessage: "Definition added"
            })
          });
        });      
      })
  };

  deleteConceptDefinition = (key) => {
    const { vocabulary, concept, definition, counts } = this.state;
    return deleteConceptDefinition(vocabulary.name, concept.name, key)
      .then(res => {
        getConcept(vocabulary.name, concept.name).then(res => {
          this.setState({
            concept: res.data,
            definition: res.data.definition.map(({ language, value }) => ({ [language]: value })),
            counts: { ...counts, [definition]: res.data.definition.length }
          });
        });      
      })
  };

  createListItem = (value, itemType) => {
    const { concept, counts } = this.state;
    const {
      match: {
        params: { key: vocabularyName }
      }
    } = this.props;
    
    return updateConcept(vocabularyName, {
      ...concept,
      [itemType]: concept[itemType] ? [value, ...concept[itemType]] : [value]
    })
      .then(res =>
        this.setState({
          concept: res.data,
          [itemType]: res.data[itemType],
          counts: { ...counts, [itemType]: res.data[itemType].length }
        })
      ).catch(error => {
        this.props.addError({
          status: error.response.status,
          statusText: error.response.data
        });
      })
      
  };
  createMapItem = (data, itemType) => {
    const { concept, counts } = this.state;
    const { key, value } = data;
    const {
      match: {
        params: { key: vocabularyName }
      }
    } = this.props;

    return updateConcept(vocabularyName, {
      ...concept,
      [itemType]: concept[itemType]
        ? { ...concept[itemType], [key]: value }
        : { [key]: value }
    })
      .then(res =>
        this.setState({
          concept: res.data,
          [itemType]: res.data[itemType],
          counts: {
            ...counts,
            [itemType]: res.data[itemType]
              ? Object.keys(res.data[itemType]).length
              : 0
          }
        })
      )
      .catch(error => {
        this.props.addError({
          status: error.response.status,
          statusText: error.response.data
        });
      })
      
  };

  updateMultiMapItems = (data, itemType) => {
    const { concept, counts } = this.state;
    const { key, values } = data;
    const {
      match: {
        params: { key: vocabularyName }
      }
    } = this.props;

    return updateConcept(vocabularyName, {
      ...concept,
      [itemType]: concept[itemType]
        ? { ...concept[itemType], [key]: values }
        : { [key]: values }
    })
      .then(res =>
        this.setState({
          concept: res.data,
          [itemType]: res.data[itemType],
          counts: {
            ...counts,
            [itemType]: res.data[itemType]
              ? Object.keys(res.data[itemType]).length
              : 0
          }
        })
      )
      .catch(error => {
        this.props.addError({
          status: error.response.status,
          statusText: error.response.data
        });
      })
      
  };

  deleteListItem = (key, itemType) => {
    const { concept, counts } = this.state;
    const {
      match: {
        params: { key: vocabularyName }
      }
    } = this.props;

    return updateConcept(vocabularyName, {
      ...concept,
      [itemType]: concept[itemType]
        .slice(0, key)
        .concat(concept[itemType].slice(key + 1, concept[itemType].length))
    })
      .then(res =>
        this.setState({
          concept: res.data,
          [itemType]: res.data[itemType],
          counts: { ...counts, [itemType]: _.get(res, `data[${itemType}].length`) || 0 }
        })
      )
      .catch(error => {
        this.props.addError({
          status: error.response.status,
          statusText: error.response.data
        });
      })
      
  };

  deleteMapItem = (item, itemType) => {
    const { concept, counts } = this.state;
    const { key } = item;
    let newMap = { ...concept[itemType] };
    delete newMap[key];
    const {
      match: {
        params: { key: vocabularyName }
      }
    } = this.props;
    
    return updateConcept(vocabularyName, {
      ...concept,
      [itemType]: newMap
    })
      .then(res => {
        this.setState({
          concept: res.data,
          [itemType]: res.data[itemType],
          counts: {
            ...counts,
            [itemType]: res.data[itemType] ? Object.keys(res.data[itemType]).length : 0
          }
        })
      } 
      )
      .catch(error => {
        this.props.addError({
          status: error.response.status,
          statusText: error.response.data
        });
      })
      
  };

  deleteMultiMapItem = (item, itemType) => {
    const { concept, counts } = this.state;
    const { key, value } = item;
    const {
      match: {
        params: { key: vocabularyName }
      }
    } = this.props;

    return updateConcept(vocabularyName, {
      ...concept,
      [itemType]: concept[itemType][key].filter(e => e !== value)
    })
      .then(res =>
        this.setState({
          concept: res.data,
          [itemType]: res.data[itemType],
          counts: {
            ...counts,
            [itemType]: res.data[itemType] ? Object.keys(res.data[itemType]).length : 0
          }
        })
      )
      .catch(error => {
        this.props.addError({
          status: error.response.status,
          statusText: error.response.data
        });
      })
      
  };
  onLanguageChange = (preferredLanguages) => {
    this.setState({preferredLanguages})
  }
  
  render() {
    const { intl } = this.props;
    const {
      match: {
        params: { key: vocabularyName, subTypeKey: conceptName }
      }
    } = this.props;
    const { vocabulary, concept, loading, counts, status, isNew , preferredLanguages, availableLanguages} = this.state;

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
      <React.Fragment><ConfigProvider renderEmpty={() => <FormattedMessage id="nodata">No data</FormattedMessage>}>
        <ItemHeader
          breadCrumbs={
            <Breadcrumb style={{ display: "flex" }} className="vocabylary-breadcrumb">
              <Breadcrumb.Item>
              <NavLink
                  to={{
                    pathname: `/vocabulary/search`
                  }}
                  exact={true}
                >
                  {intl.formatMessage({
                  id: "vocabulary",
                  defaultMessage: "Vocabulary"
                })}
                </NavLink>
                
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink
                  to={{
                    pathname: `/vocabulary/${vocabularyName}`
                  }}
                  exact={true}
                >
                  {vocabularyName}
                </NavLink>
              </Breadcrumb.Item>
              {concept &&
                concept.parents &&
                _.reverse([...concept.parents]).map(p => (
                  <Breadcrumb.Item key={p}>
                    <NavLink
                      to={{
                        pathname: `/vocabulary/${vocabularyName}/concept/${p}`
                      }}
                      exact={true}
                    >
                      {p}
                    </NavLink>
                  </Breadcrumb.Item>
                ))}
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
            <React.Fragment>
              <Actions
                concept={concept}
                onChange={error => this.update(error)}
              />
              <LanguageSelect
                onChange={this.onLanguageChange}
                languages={availableLanguages}
              ></LanguageSelect>
            </React.Fragment>
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
            path="/vocabulary/:key/:section/:subTypeKey/:subTypeSection?"
            render={() => (
              <ItemMenu
                counts={counts}
                config={MenuConfig}
                isNew={concept === null}
              >
                <Switch>
                  <Route
                    exact
                    path={`/vocabulary/:key/:section/:subTypeKey`}
                    render={() => (
                      <ConceptDetails
                        concept={concept}
                        vocabulary={vocabulary}
                        refresh={key => this.refresh(key)}
                        createConceptLabel={this.createConceptLabel}
                        deleteConceptLabel={this.deleteConceptLabel}
                        createConceptDefinition={this.createConceptDefinition}
                        deleteConceptDefinition={this.deleteConceptDefinition}
                        createMapItem={this.createMapItem}
                        deleteMapItem={this.deleteMapItem}
                        createListItem={this.createListItem}
                        deleteListItem={this.deleteListItem}
                        updateMultiMapItems={this.updateMultiMapItems}
                        preferredLanguages={preferredLanguages}
                      />
                    )}
                  />
                  <Route
                    path={`/vocabulary/:key/:section/:subTypeKey/children`}
                    render={() => (
                      <ConceptList
                      preferredLanguages={preferredLanguages}
                        parent={concept}
                        vocabulary={vocabulary}
                        initQuery={{ parentKey: concept.key }}
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
                  />

                  <Route component={Exception404} />
                </Switch>
              </ItemMenu>
            )}
          />
        </PageWrapper>
        </ConfigProvider>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError, addSuccess }) => ({
  addError,
  addSuccess
});

export default withContext(mapContextToProps)(withRouter(injectIntl(Concept)));
