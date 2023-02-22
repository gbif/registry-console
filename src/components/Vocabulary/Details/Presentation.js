import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";

import { PresentationItem } from "../../common";
import MetaData from "../../common/MetaData";
import ItemMap from "../subtypes/Item/ItemMap";
import ItemList from "../subtypes/Item/ItemList";
import SingleFieldForm from "./SingleFieldForm";
import { roles } from "../../auth/enums";

const VocabularyPresentation = ({
  vocabulary,
  preferredLanguages,
  createVocabularyLabel,
  deleteVocabularyLabel,
  createVocabularyDefinition,
  deleteVocabularyDefinition,
  updateVocabularyDefinition,
  createListItem,
  deleteListItem,
  onSubmit,
  editMode
}) => (
  <div>
    {vocabulary ? (
      <React.Fragment>
        <dl>
          <PresentationItem
            label={<FormattedMessage id="name" defaultMessage="Name" />}
            helpText={
              <FormattedMessage
                id="help.vocabularyName"
                defaultMessage="Enter an accurate vocabulary name as it is used in many key places."
              />
            }
            required
          >
            {vocabulary.name}
          </PresentationItem>
          <PresentationItem
            label={
              <FormattedMessage id="namespace" defaultMessage="Namespace" />
            }
          >
            {editMode ? <SingleFieldForm vocabulary={vocabulary} fieldName="namespace" onSubmit={onSubmit}/> : vocabulary.namespace}
          </PresentationItem>
          <PresentationItem
            label={<FormattedMessage id="labels" defaultMessage="Labels" />}
          >
            <ItemMap
              editMode={editMode}
              itemName="label"
              items={!vocabulary.label ? [] : vocabulary.label.map(({ key ,language, value })  => ({
                key: key,
                language: language,
                value: value
              }))}
              createItem={data => createVocabularyLabel(data)}
              deleteItem={itemKey => deleteVocabularyLabel(itemKey)}
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
              preferredLanguages={preferredLanguages}
            />
          </PresentationItem>
          <PresentationItem
            label={
              <FormattedMessage id="definitions" defaultMessage="Definitions" />
            }
          >
            <ItemMap
              editMode={editMode}
              itemName="definition"
              items={!vocabulary.definition ? [] : vocabulary.definition.map(({ key, language, value })  => ({
                key: key,
                language: language,
                value: value
              }))}
              vocabulary={vocabulary}
              createItem={data => createVocabularyDefinition(data)}
              deleteItem={itemKey => deleteVocabularyDefinition(itemKey)}
              updateItem={data => updateVocabularyDefinition(data)}
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
              preferredLanguages={preferredLanguages}
              isUpdate={true}

            />
          </PresentationItem>
          <PresentationItem
            label={
              <FormattedMessage id="externalDefinitions" defaultMessage="External definitions" />
            }
          >
            <ItemList
            editMode={editMode}
                        itemName="externalDefinitions"
                        items={!vocabulary.externalDefinitions ? [] : vocabulary.externalDefinitions.map((n, index) => ({
                          key: index,
                          value: n
                        }))}
                        createItem={data =>
                          createListItem(data.value, "externalDefinitions")
                        }
                        deleteItem={itemKey =>
                          deleteListItem(itemKey, "externalDefinitions")
                        }
                        permissions={{ roles: [roles.VOCABULARY_ADMIN] }}

                      />
          </PresentationItem>
          <PresentationItem
            label={
              <FormattedMessage id="editorialNotes" defaultMessage="Editorial notes" />
            }
          >
            <ItemList
            editMode={editMode}
                        itemName="editorialNotes"
                        items={!vocabulary.editorialNotes ? [] : vocabulary.editorialNotes.map((n, index) => ({
                          key: index,
                          value: n
                        }))}
                        createItem={data =>
                          createListItem(data.value, "editorialNotes")
                        }
                        deleteItem={itemKey =>
                          deleteListItem(itemKey, "editorialNotes")
                        }
                        permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
                      />
          </PresentationItem>
        </dl>
        <MetaData item={vocabulary} />
      </React.Fragment>
    ) : null}
  </div>
);

VocabularyPresentation.propTypes = {
  vocabulary: PropTypes.object,
  selectedLanguages: PropTypes.array
};

export default VocabularyPresentation;
