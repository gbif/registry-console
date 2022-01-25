import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Input, Alert, Modal, Form } from "antd";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import _ from "lodash";
// APIs
import {
  createConcept,
  updateConcept,
  searchConcepts
} from "../../../../../api/vocabulary";
// Wrappers
import withContext from "../../../../hoc/withContext";
// Components
import { FormItem } from "../../../../common";
import { FilteredSelectControl } from "../../../../common";

const styles = {
  customGroup: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    "& .ant-checkbox-group-item": {
      flex: "50%",
      margin: 0
    }
  }
};

const ConceptForm = props => {
  const {vocabulary, concept, parent, onCancel,onSubmit, addError, visible} = props;
  const [parents, setParents] = useState([]);
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(null);
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
      
        if (concept) {
          updateConcept(vocabulary?.name, {
            ..._.omit(concept, "parents"),
            ...values
          })
            .then(() => {
              setError(null)
              onSubmit()
            })
            .catch(error => {
              setError(error)
              addError({
                status: error.response.status,
                statusText: error.response.data
              });
            });
        } else {
          let defaults = { vocabularyKey: vocabulary?.key };
          if (parent) {
            defaults.parentKey = parent?.key;
          }
          createConcept(vocabulary?.name, { ...values, ...defaults })
            .then(() => {
              setError(null)
              onSubmit()
            })
            .catch(error => {
              setError(error)
              addError({
                status: error.response.status,
                statusText: error.response.data
              });
            });
        }
  };

  const handleParentSearch = value => {
    if (!value) {
      setParents([]);
      return;
    }
    setFetching(true)

    searchConcepts(vocabulary?.name, { q: value }).then(response => {
      setParents(_.get(response, "data.results[0]")
      ? response.data.results.map(r => ({
          ...r,
          disabled:
            concept &&
            (r.parentKey === concept.key || r.key === concept.key)
        }))
      : []);
      setFetching(false)
    });
  };

    let initialValues = {...concept}

    return (
      <React.Fragment>
        <Modal
          visible={visible}
          title={
            concept ? (
              <FormattedMessage
                id="updateConcept"
                defaultMessage="Update concept"
              />
            ) : (
              <FormattedMessage
                id="createNewConcept"
                defaultMessage="Create a new concept"
              />
            )
          }
          okText={
            concept ? (
              <FormattedMessage id="update" defaultMessage="Update" />
            ) : (
              <FormattedMessage id="create" defaultMessage="Create" />
            )
          }
          onOk={handleSubmit}
          onCancel={onCancel}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form initialValues={initialValues} form={form}>
            <FormItem
              name="name"
              label={
                <FormattedMessage
                  id="conceptName"
                  defaultMessage="Concept name"
                />
              }
              helpText={
                <FormattedMessage
                  id="help.conceptName"
                  defaultMessage="Name of the concept, e.g. Preserved specimen"
                />
              }
            >
              <Input disabled={concept ? true : false} />
            </FormItem>

            <FormItem
              name="parentKey"
              label={
                <FormattedMessage
                  id="parentConcept"
                  defaultMessage="Parent concept"
                />
              }
            >
              <FilteredSelectControl
                  placeholder={
                    <FormattedMessage
                      id="select.parent"
                      defaultMessage="Select a parent concept"
                    />
                  }
                  search={handleParentSearch}
                  fetching={fetching}
                  items={[{ key: null, name: "No parent" }, ...parents]}
                  titleField="name"
                  delay={300}
                />
            </FormItem>
            {error && (
              <Alert
                style={{marginTop: '5px'}}
                message={_.get(error, "response.data.error")}
                description={_.get(error, "response.data.message")}
                type="error"
                closable
                onClose={() => setError(null)}
              />
            )}
          </Form>
        </Modal>
      </React.Fragment>
    );
  
}

ConceptForm.propTypes = {
  //  user: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ addError }) => ({
  addError
});

export default withContext(mapContextToProps)(injectSheet(styles)(ConceptForm));