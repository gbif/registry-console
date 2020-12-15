import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { PresentationItem } from "../../../../common";
import MetaData from "../../../../common/MetaData";
import ItemMap from "../../../subtypes/Item/ItemMap";
import ItemList from "../../../subtypes/Item/ItemList";
import ItemMultiMap from "../../../subtypes/Item/ItemMultiMap";
import { roles } from "../../../../auth/enums";
import ParentSelect from "./ParentSelect";
const ConceptPresentation = ({
  concept,
  vocabulary,
  preferredLanguages,
  createMapItem,
  deleteMapItem,
  createListItem,
  deleteListItem,
  updateMultiMapItems,
  editMode,
  onSubmit,
  onCancel,
}) => (
  <div>
    {concept ? (
      <React.Fragment>
        <dl>
          <PresentationItem
            label={<FormattedMessage id="name" defaultMessage="Name" />}
            helpText={
              <FormattedMessage
                id="help.conceptName"
                defaultMessage="Enter an accurate concept name as it is used in many key places."
              />
            }
            required
          >
            {concept.name}
          </PresentationItem>

          <PresentationItem
            label={
              <FormattedMessage
                id="parentConcept"
                defaultMessage="Parent concept"
              />
            }
          >
           {(!editMode && concept.parents && concept.parents.length > 0) && <NavLink
              to={{
                pathname: `/vocabulary/${vocabulary.name}/concept/${concept.parents[0]}`,
              }}
              exact={true}
            >
              {concept.parents[0]
                }
            </NavLink> }

           {editMode && <ParentSelect vocabulary={vocabulary} concept={concept} onSubmit={onSubmit}/>}
          </PresentationItem>

          <PresentationItem
            label={<FormattedMessage id="labels" defaultMessage="Labels" />}
          >
            <ItemMap
              editMode={editMode}
              itemName="label"
              items={
                !concept.label
                  ? []
                  : Object.keys(concept.label).map((key) => ({
                      key: key,
                      value: concept.label[key],
                    }))
              }
              createItem={(data) => createMapItem(data, "label")}
              deleteItem={(itemKey) => deleteMapItem(itemKey, "label")}
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
              preferredLanguages={preferredLanguages}
            />
          </PresentationItem>
          <PresentationItem
            label={
              <FormattedMessage
                id="alternativeLabels"
                defaultMessage="Alternative labels"
              />
            }
          >
            <ItemMultiMap
              editMode={editMode}
              itemName="alternativeLabels"
              items={
                !concept.alternativeLabels
                  ? []
                  : Object.keys(concept.alternativeLabels).map((key) => ({
                      key: key,
                      value: concept.alternativeLabels[key],
                    }))
              }
              updateItem={(data) =>
                updateMultiMapItems(data, "alternativeLabels")
              }
              deleteItem={(itemKey) =>
                deleteMapItem(itemKey, "alternativeLabels")
              }
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
              preferredLanguages={preferredLanguages}
            />
          </PresentationItem>
          <PresentationItem
            label={
              <FormattedMessage
                id="hiddenLabels"
                defaultMessage="Hidden labels"
              />
            }
          >
            <ItemList
              editMode={editMode}
              itemName="hiddenLabels"
              items={
                !concept.hiddenLabels
                  ? []
                  : concept.hiddenLabels.map((n, index) => ({
                      key: index,
                      value: n,
                    }))
              }
              createItem={(data) => createListItem(data.value, "hiddenLabels")}
              deleteItem={(itemKey) => deleteListItem(itemKey, "hiddenLabels")}
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
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
              items={
                !concept.definition
                  ? []
                  : Object.keys(concept.definition).map((key) => ({
                      key: key,
                      value: concept.definition[key],
                    }))
              }
              createItem={(data) => createMapItem(data, "definition")}
              deleteItem={(itemKey) => deleteMapItem(itemKey, "definition")}
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
              preferredLanguages={preferredLanguages}
            />
          </PresentationItem>
          <PresentationItem
            label={
              <FormattedMessage
                id="externalDefinitions"
                defaultMessage="External definitions"
              />
            }
          >
            <ItemList
              editMode={editMode}
              itemName="externalDefinitions"
              items={
                !concept.externalDefinitions
                  ? []
                  : concept.externalDefinitions.map((n, index) => ({
                      key: index,
                      value: n,
                    }))
              }
              createItem={(data) =>
                createListItem(data.value, "externalDefinitions")
              }
              deleteItem={(itemKey) =>
                deleteListItem(itemKey, "externalDefinitions")
              }
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
            />
          </PresentationItem>
          <PresentationItem
            label={
              <FormattedMessage id="sameAsUris" defaultMessage="Same as URIs" />
            }
          >
            <ItemList
              editMode={editMode}
              itemName="sameAsUris"
              items={
                !concept.sameAsUris
                  ? []
                  : concept.sameAsUris.map((n, index) => ({
                      key: index,
                      value: n,
                    }))
              }
              createItem={(data) => createListItem(data.value, "sameAsUris")}
              deleteItem={(itemKey) => deleteListItem(itemKey, "sameAsUris")}
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
            />
          </PresentationItem>
          <PresentationItem
            label={
              <FormattedMessage
                id="editorialNotes"
                defaultMessage="Editorial notes"
              />
            }
          >
            <ItemList
              editMode={editMode}
              itemName="editorialNotes"
              items={
                !concept.editorialNotes
                  ? []
                  : concept.editorialNotes.map((n, index) => ({
                      key: index,
                      value: n,
                    }))
              }
              createItem={(data) =>
                createListItem(data.value, "editorialNotes")
              }
              deleteItem={(itemKey) =>
                deleteListItem(itemKey, "editorialNotes")
              }
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
            />
          </PresentationItem>
        </dl>
        <MetaData item={concept} />
      </React.Fragment>
    ) : null}
  </div>
);

ConceptPresentation.propTypes = {
  concept: PropTypes.object,
  selectedLanguages: PropTypes.array,
};

export default ConceptPresentation;
