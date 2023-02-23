import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { PresentationItem } from "../../../../common";
import MetaData from "../../../../common/MetaData";
import ItemMap from "../../../subtypes/Item/ItemMap";
import ItemList from "../../../subtypes/Item/ItemList";
import { roles } from "../../../../auth/enums";
import ParentSelect from "./ParentSelect";
import ConceptTags from "./ConceptTags"
const ConceptPresentation = ({
  concept,
  vocabulary,
  preferredLanguages,
  createConceptLabel,
  deleteConceptLabel,
  createConceptDefinition,
  deleteConceptDefinition,
  updateConceptDefinition,
  createListItem,
  deleteListItem,
  editMode,
  onSubmit,
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
            label={
              <FormattedMessage
                id="conceptTags"
                defaultMessage="Tags"
              />
            }
          >
           <ConceptTags editMode={editMode} vocabulary={vocabulary} concept={concept}/>
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
                !concept.definition? [] : concept.definition.map(({ key ,language, value })  => ({
                    key: key,
                    language: language,
                    value: value
              }))}
              createItem={(data) => createConceptDefinition(data)}
              deleteItem={(itemKey) => deleteConceptDefinition(itemKey)}
              updateItem={data => updateConceptDefinition(data)}
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
              preferredLanguages={preferredLanguages}
              isUpdate={true}
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
            label={<FormattedMessage id="labels" defaultMessage="Labels" />}
          >
            <ItemMap
              editMode={editMode}
              itemName="label"
              items={
                !concept.label? [] : concept.label.map(({ key ,language, value })  => ({
                    key: key,
                    language: language,
                    value: value
              }))}
              createItem={(data) => createConceptLabel(data)}
              deleteItem={(itemKey) => deleteConceptLabel(itemKey)}
              permissions={{ roles: [roles.VOCABULARY_ADMIN] }}
              preferredLanguages={preferredLanguages}
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
