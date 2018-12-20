import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Form, Input } from 'antd';

import { createCollection, updateCollection } from '../../../api/grbio.collection';
import { institutionSearch } from '../../../api/grbio.institution';
import { FilteredSelectControl } from '../../widgets';
import formValidationWrapper from '../../hoc/formValidationWrapper';
import withContext from '../../hoc/withContext';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 8 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 16 }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};

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
        <Form onSubmit={this.handleSubmit} layout={'vertical'}>
          <FormItem {...formItemLayout} label={<FormattedMessage id="name" defaultMessage="Name"/>}>
            {getFieldDecorator('name', {
              initialValue: collection && collection.name,
              rules: [{
                required: true, message: <FormattedMessage id="provide.name" defaultMessage="Please provide a name"/>
              }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}
          >
            {getFieldDecorator('homepage', {
              initialValue: collection && collection.homepage,
              rules: [{ validator: handleHomepage }]
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="institution" defaultMessage="Institution"/>}
          >
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

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              {collection ?
                <FormattedMessage id="edit" defaultMessage="Edit"/> :
                <FormattedMessage id="create" defaultMessage="Create"/>
              }
            </Button>
          </FormItem>
        </Form>
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

const WrappedCollectionForm = Form.create()(withContext(mapContextToProps)(formValidationWrapper(CollectionForm)));
export default WrappedCollectionForm;