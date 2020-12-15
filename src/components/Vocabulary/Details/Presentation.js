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
  createMapItem,
  deleteMapItem,
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
              items={!vocabulary.label ? [] : Object.keys(vocabulary.label).map(key => ({
                key: key,
                value: vocabulary.label[key]
              }))}
              createItem={data => createMapItem(data, "label")}
              deleteItem={itemKey => deleteMapItem(itemKey, "label")}
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
              items={!vocabulary.definition ? [] : Object.keys(vocabulary.definition).map(key => ({
                key: key,
                value: vocabulary.definition[key]
              }))}
              createItem={data => createMapItem(data, "definition")}
              deleteItem={itemKey => deleteMapItem(itemKey, "definition")}
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
              preferredLanguages={preferredLanguages}

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
