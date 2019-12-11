import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input, Select, Checkbox, Col, Row, Modal } from 'antd';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

// APIs
import { createConcept, updateConcept } from '../../../../../api/vocabulary';
// Wrappers
import withContext from '../../../../hoc/withContext';
// Components
import { FormItem } from '../../../../common';
// Helpers

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const styles = {
  customGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    '& .ant-checkbox-group-item': {
      flex: '50%',
      margin: 0
    }
  }
};

class ConceptForm extends Component {
  state = {
    roles: []
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
        if(this.props.concept){
          updateConcept(this.props.vocabularyName, { ...this.props.concept, ...values })
          .then(() => this.props.onSubmit())
          .catch(error => {
            this.props.addError({ status: error.response.status, statusText: error.response.data });
          });
        } else {
          let defaults = {vocabularyKey: this.props.vocabulary.key};
          if(this.props.parent){
            defaults.parentKey = this.props.parent.key
          }
          createConcept(this.props.vocabulary.name, { ...values, ...defaults })
          .then(() => this.props.onSubmit())
          .catch(error => {
            this.props.addError({ status: error.response.status, statusText: error.response.data });
          });
        }
        
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { concept, classes, onCancel, form, visible } = this.props;

    return (
      <React.Fragment>
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewConcept" defaultMessage="Create a new concept"/>}
          okText={<FormattedMessage id="create" defaultMessage="Create"/>}
          onOk={this.handleSubmit}
          onCancel={onCancel}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
        <Form >
          <FormItem
            label={<FormattedMessage id="conceptName" defaultMessage="Concept name"/>}
            helpText={
              <FormattedMessage
                id="help.conceptName"
                defaultMessage="Name of the concept, e.g. Preserved specimen"
              />
            }
          >
            {getFieldDecorator('name', { initialValue: concept ? concept.name : '' })(
              <Input disabled={concept ? true : false}/>
            )}
          </FormItem>
          <FormItem
            label={<FormattedMessage id="nameSpace" defaultMessage="Name space"/>}
            helpText={
              <FormattedMessage
                id="help.nameSpace"
                defaultMessage="Name space of the concept, e.g. http://rs.tdwg.org/dwc/dwctype/PreservedSpecimen"
              />
            }
          >
            {getFieldDecorator('nameSpace', { initialValue: concept ? concept.nameSpace : '' })(
              <Input />
            )}
          </FormItem>

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

const mapContextToProps = ({ countries, addError }) => ({ countries, addError });

const WrappedOrganizationForm = Form.create()(withContext(mapContextToProps)(injectSheet(styles)(ConceptForm)));
export default WrappedOrganizationForm;