import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Route, Switch, NavLink, withRouter } from "react-router-dom";
import {ConfigProvider} from "antd"
// APIs
import {
  getVocabulary,
  updateVocabulary,
  createConcept,
  deprecateConcept,
  searchConcepts,
  addVocabularyLabel,
  deleteVocabularyLabel,
  addVocabularyDefinition,
  deleteVocabularyDefinition,
  updateVocabularyDefinition
} from "../../api/vocabulary";
// Wrappers

import Exception404 from "../exception/404";
import PageWrapper from "../hoc/PageWrapper";
import withContext from "../hoc/withContext";
// Configuration
import MenuConfig from "./menu.config";
// Components
import VocabularyDetails from "./Details";
import { CreationFeedback, ItemHeader, ItemMenu } from "../common";

import LanguageSelect from "./LanguageSelect"
import ConceptList from "./subtypes/ConceptList";
import Actions from "./vocabulary.actions";
// Helpers
import { getSubMenu } from "../util/helpers";

class Vocabulary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      availableLanguages: [],
      preferredLanguages: [],
      vocabulary: null,
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
    if (this.props.match.params.key) {
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
    try{
    const vocabularyResponse = await getVocabulary(this.props.match.params.key);
    const conceptCountResponse = await searchConcepts(this.props.match.params.key, {limit:0})
    const {data} = vocabularyResponse;
    const conceptCount = conceptCountResponse?.data?.count;
    if (this._isMount) {
      this.setState({
        vocabulary: data,
        availableLanguages: data.label ? Object.keys(data.label): [],
        loading: false,
        externalDefinitions: data.externalDefinitions || [],
        editorialNotes: data.editorialNotes || [],
        label: data.label.map(({ language, value }) => ({ [language]: value })) || {},
        definition: data.definition.map(({ language, value }) => ({ [language]: value })) || {},
        counts: {
          externalDefinitions: data.externalDefinitions
            ? data.externalDefinitions.length
            : 0,
          editorialNotes: data.editorialNotes
            ? data.editorialNotes.length
            : 0,
          label: data.label ? data.label.length : 0,
          definition: data.definition ? data.definition.length : 0,
          concepts: conceptCount || 0
        }
      });
    }
    } catch(err){
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


/*     getVocabulary(this.props.match.params.key)
      .then(({ data }) => {
        // If user lives the page, request will return result anyway and tries to set in to a state
        // which will cause an error
        if (this._isMount) {
          this.setState({
            vocabulary: data,
            availableLanguages: data.label ? Object.keys(data.label): [],
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
                : 0,
              concepts: 0
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
      }); */
  }

  getConceptCount = () => {
    return searchConcepts(this.props.match.params.key, {limit:0})
      .then(res => {
       this.updateCounts('concepts', res.data.count) 
      })
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
    const { vocabulary, loading } = this.state;

    if (vocabulary) {
      return vocabulary.name;
    } else if (!loading) {
      return intl.formatMessage({
        id: "newVocabulary",
        defaultMessage: "New vocabulary"
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

  createVocabularyLabel = (labelData) => {
    const { vocabulary, label, counts } = this.state;
    return addVocabularyLabel(vocabulary.name, labelData)
      .then(res => {
        getVocabulary(vocabulary.name).then(res => {
          this.setState({
            vocabulary: res.data,
            label: res.data.label.map(({ language, value }) => ({ [language]: value })),
            counts: { ...counts, [label]: res.data.label.length }
          });
          this.props.addSuccess({
            status: 200,
            statusText: this.props.intl.formatMessage({
              // TODO: translations??
              id: "addedLabel.vocabulary",
              defaultMessage: "Label added"
            })
          });
        });      
      })
  };

  deleteVocabularyLabel = (key) => {
    const { vocabulary, label, counts } = this.state;
    return deleteVocabularyLabel(vocabulary.name, key)
      .then(res => {
        getVocabulary(vocabulary.name).then(res => {
          this.setState({
            vocabulary: res.data,
            label: res.data.label.map(({ language, value }) => ({ [language]: value })),
            counts: { ...counts, [label]: res.data.label ? res.data.label.length : 0 }
          });
        });      
      })
  };

  createVocabularyDefinition = (definitionData) => {
    const { vocabulary, definition, counts } = this.state;
    return addVocabularyDefinition(vocabulary.name, definitionData)
      .then(res => {
        getVocabulary(vocabulary.name).then(res => {
          this.setState({
            vocabulary: res.data,
            definition: res.data.definition.map(({ language, value }) => ({ [language]: value })),
            counts: { ...counts, [definition]: res.data.definition.length }
          });
          this.props.addSuccess({
            status: 200,
            statusText: this.props.intl.formatMessage({
              // TODO: translations??
              id: "addedDefinition.vocabulary",
              defaultMessage: "Definition added"
            })
          });
        });      
      })
  };

  updateVocabularyDefinition = (definitionData) => {
    const { vocabulary, definition, counts } = this.state;
    return updateVocabularyDefinition(vocabulary.name, definitionData)
      .then(res => {
        getVocabulary(vocabulary.name).then(res => {
          this.setState({
            vocabulary: res.data,
            definition: res.data.definition.map(({ language, value }) => ({ [language]: value })),
            counts: { ...counts, [definition]: res.data.definition.length }
          });
          this.props.addSuccess({
            status: 200,
            statusText: this.props.intl.formatMessage({
              // TODO: translations??
              id: "updatedDefinition.vocabulary",
              defaultMessage: "Definition updated"
            })
          });
        });      
      })
  };

  deleteVocabularyDefinition = (key) => {
    const { vocabulary, definition, counts } = this.state;
    return deleteVocabularyDefinition(vocabulary.name, key)
      .then(res => {
        getVocabulary(vocabulary.name).then(res => {
          this.setState({
            vocabulary: res.data,
            definition: res.data.definition.map(({ language, value }) => ({ [language]: value })),
            counts: { ...counts, [definition]: res.data.definition.length }
          });
        });      
      })
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
          counts: { ...counts, [itemType]: res.data[itemType] ? Object.keys(res.data[itemType]).length : 0 }
        })
      )
      
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
      
  };

  deleteMapItem = (item, itemType) => {
    const { vocabulary, counts } = this.state;
    const {key} = item;
    let newMap = {...vocabulary[itemType]}
    delete newMap[key];
    return updateVocabulary({
      ...vocabulary,
      [itemType]: newMap
    })
      .then(res =>
        this.setState({
          vocabulary: res.data,
          [itemType]: res.data[itemType],
          counts: { ...counts, [itemType]: Object.keys(res.data[itemType]).length }
        })
      )
      
  };

  onLanguageChange = (preferredLanguages) => {
    this.setState({preferredLanguages})
  }

  render() {
    const { intl } = this.props;
    const {
      vocabulary,
      loading,
      counts,
      status,
      isNew,
      availableLanguages,
      preferredLanguages
    } = this.state;

    // Parameters for ItemHeader with BreadCrumbs and page title
    const listName = intl.formatMessage({
      id: "vocabularies",
      defaultMessage: "Vocabularies"
    });
    const submenu = getSubMenu(this.props);
    const pageTitle =
      vocabulary || loading
        ? intl.formatMessage({
            id: "title.vocabulary",
            defaultMessage: "Vocabulary | GBIF Registry"
          })
        : intl.formatMessage({
            id: "title.newVocabulary",
            defaultMessage: "New vocabulary | GBIF Registry"
          });
    const title = this.getTitle();

    return (
      <React.Fragment><ConfigProvider renderEmpty={() => <FormattedMessage id="nodata">No data</FormattedMessage>}>

        <ItemHeader
          listType={[ <NavLink
            to={{
              pathname: `/vocabulary/search`
            }}
            exact={true}
          >
            {listName}
          </NavLink>]}
          title={title}
          submenu={submenu}
          pageTitle={pageTitle}
          status={status}
          loading={loading}
          usePaperWidth
        >
          {vocabulary && (
            <React.Fragment>
            <Actions
              vocabulary={vocabulary}
              onChange={error => this.update(error)}
            />
            <LanguageSelect onChange={this.onLanguageChange} languages={availableLanguages}></LanguageSelect>
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
            path="/:type?/:key?/:section?"
            render={() => (
              <ItemMenu
                counts={counts}
                config={MenuConfig}
                isNew={vocabulary === null}
              >
                <Switch>
                  <Route
                    exact
                    path={`/vocabulary/:key`}
                    render={() => (
                      <VocabularyDetails
                        vocabulary={vocabulary}
                        refresh={key => this.refresh(key)}
                        createMapItem={this.createMapItem}
                        createVocabularyLabel={this.createVocabularyLabel}
                        deleteVocabularyLabel={this.deleteVocabularyLabel}
                        createVocabularyDefinition={this.createVocabularyDefinition}
                        deleteVocabularyDefinition={this.deleteVocabularyDefinition}
                        updateVocabularyDefinition={this.updateVocabularyDefinition}
                        deleteMapItem={this.deleteMapItem}
                        createListItem={this.createListItem}
                        deleteListItem={this.deleteListItem}
                        preferredLanguages={preferredLanguages}
                      />
                    )}
                  />

                

                  <Route
                    path={`/vocabulary/:key/concepts`}
                    render={() => (
                      <ConceptList
                        preferredLanguages={preferredLanguages}
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

export default withContext(mapContextToProps)(
  withRouter(injectIntl(Vocabulary))
);
