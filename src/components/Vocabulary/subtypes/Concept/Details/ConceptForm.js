import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Form, Input, Alert, Modal } from "antd";
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

class ConceptForm extends Component {
  state = {
    parents: [],
    fetching: false,
    error: null
  };

  componentDidMount() {
    /* getRoles().then(response => {
      this.setState({ roles: response.data });
    }); */
  }

  handleSubmit = () => {
    // if (this.props.organization && !this.props.form.isFieldsTouched()) {
    //   return;
    // }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.concept) {
          updateConcept(this.props.vocabulary.name, {
            ..._.omit(this.props.concept, "parents"),
            ...values
          })
            .then(() => {
              this.setState({ error: null }, this.props.onSubmit);
            })
            .catch(error => {
              this.setState({ error });
              this.props.addError({
                status: error.response.status,
                statusText: error.response.data
              });
            });
        } else {
          let defaults = { vocabularyKey: this.props.vocabulary.key };
          if (this.props.parent) {
            defaults.parentKey = this.props.parent.key;
          }
          createConcept(this.props.vocabulary.name, { ...values, ...defaults })
            .then(() => {
              this.setState({ error: null }, this.props.onSubmit);
            })
            .catch(error => {
              this.setState({ error });
              this.props.addError({
                status: error.response.status,
                statusText: error.response.data
              });
            });
        }
      }
    });
  };

  handleParentSearch = value => {
    const { concept } = this.props;
    if (!value) {
      this.setState({ parents: [] });
      return;
    }

    this.setState({ fetching: true });

    searchConcepts(this.props.vocabulary.name, { q: value }).then(response => {
      this.setState({
        parents: _.get(response, "data.results[0]")
          ? response.data.results.map(r => ({
              ...r,
              disabled:
                concept &&
                (r.parentKey === concept.key || r.key === concept.key)
            }))
          : [],
        fetching: false
      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { concept, classes, onCancel, form, visible } = this.props;
    const { parents, fetching, error } = this.state;

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
          onOk={this.handleSubmit}
          onCancel={onCancel}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form>
            <FormItem
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
              {getFieldDecorator("name", {
                initialValue: concept ? concept.name : ""
              })(<Input disabled={concept ? true : false} />)}
            </FormItem>

            <FormItem
              label={
                <FormattedMessage
                  id="parentConcept"
                  defaultMessage="Parent concept"
                />
              }
            >
              {getFieldDecorator("parentKey", {
                initialValue:
                  concept && concept.parents ? concept.parents[0] : undefined
              })(
                <FilteredSelectControl
                  placeholder={
                    <FormattedMessage
                      id="select.parent"
                      defaultMessage="Select a parent concept"
                    />
                  }
                  search={this.handleParentSearch}
                  fetching={fetching}
                  items={[{ key: null, name: "No parent" }, ...parents]}
                  titleField="name"
                  delay={300}
                />
              )}
            </FormItem>
            {error && (
              <Alert
                style={{marginTop: '5px'}}
                message={_.get(error, "response.data.error")}
                description={_.get(error, "response.data.message")}
                type="error"
                closable
                onClose={() => this.setState({ error: null })}
              />
            )}
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

ConceptForm.propTypes = {
  //  user: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

const mapContextToProps = ({ countries, addError }) => ({
  countries,
  addError
});

const WrappedOrganizationForm = Form.create()(
  withContext(mapContextToProps)(injectSheet(styles)(ConceptForm))
);
export default WrappedOrganizationForm;
