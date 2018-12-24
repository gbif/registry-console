import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Form, Input, Row } from 'antd';

import { createCollection, updateCollection } from '../../../api/grbio.collection';
import { institutionSearch } from '../../../api/grbio.institution';
import { FilteredSelectControl, FormItem } from '../../widgets';
import formValidationWrapper from '../../hoc/formValidationWrapper';
import withContext from '../../hoc/withContext';

class CollectionForm extends Component {
  constructor(props) {
    super(props);

    const { collection } = props;
    const institutions = collection && collection.institution ? [collection.institution] : [];

    this.state = {
      fetching: false,
      institutions
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // if (this.props.data && !this.props.form.isFieldsTouched()) {
    //   return;
    // }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!this.props.data) {
          createCollection(values)
            .then(response => this.props.onSubmit(response.data))
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        } else {
          updateCollection({ ...this.props.data, ...values })
            .then(() => this.props.onSubmit())
            .catch(error => {
              this.props.addError({ status: error.response.status, statusText: error.response.data });
            });
        }
      }
    });
  };


  handleSearch = value => {
    if (!value) {
      this.setState({ institutions: [] });
      return;
    }

    this.setState({ fetching: true });

    institutionSearch({ q: value }).then(response => {
      this.setState({
        institutions: response.data.results,
        fetching: false
      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { collection, handleHomepage } = this.props;
    const { institutions, fetching } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: '4px' }}>
          <FormItem label={<FormattedMessage id="name" defaultMessage="Name"/>}>
            {getFieldDecorator('name', {
              initialValue: collection && collection.name,
              rules: [{
                required: true, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}>
            {getFieldDecorator('homepage', {
              initialValue: collection && collection.homepage,
              rules: [{ validator: handleHomepage }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem label={<FormattedMessage id="institution" defaultMessage="Institution"/>}>
            {getFieldDecorator('institutionKey', {
              initialValue: collection ? collection.institutionKey : undefined,
              rules: [{
                required: true,
                message: <FormattedMessage
                  id="provide.institution"
                  defaultMessage="Please provide an institution"
                />
              }]
            })(
              <FilteredSelectControl
                placeholder={<FormattedMessage
                  id="select.institution"
                  defaultMessage="Select an institution"
                />}
                search={this.handleSearch}
                fetching={fetching}
                items={institutions}
                delay={1000}
              />
            )}
          </FormItem>

          <Row>
            <Col className="btn-container text-right">
              <Button htmlType="button" onClick={this.props.onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
              </Button>
              <Button type="primary" htmlType="submit">
                {collection ?
                  <FormattedMessage id="edit" defaultMessage="Edit"/> :
                  <FormattedMessage id="create" defaultMessage="Create"/>
                }
              </Button>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

const WrappedCollectionForm = Form.create()(withContext(mapContextToProps)(formValidationWrapper(CollectionForm)));
export default WrappedCollectionForm;