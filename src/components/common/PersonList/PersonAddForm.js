import React from 'react';
import { Modal, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { personSearch } from '../../../api/grbio.person';
// Components
import { FilteredSelectControl, FormItem } from '../../widgets';

const PersonAddForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      persons: [],
      fetching: false
    };

    handleSearch = value => {
      if (!value) {
        this.setState({ institutions: [] });
        return;
      }

      this.setState({ fetching: true });

      personSearch({ q: value }).then(response => {
        this.setState({
          persons: response.data.results,
          fetching: false
        });
      });
    };

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const { persons, fetching } = this.state;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="addNewContact" defaultMessage="Add a new contact"/>}
          okText={<FormattedMessage id="add" defaultMessage="Add"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form>
            <FormItem label={<FormattedMessage id="contact" defaultMessage="Contact"/>}>
              {getFieldDecorator('key')(
                <FilteredSelectControl
                  placeholder={<FormattedMessage
                    id="select.person"
                    defaultMessage="Select a person"
                  />}
                  search={this.handleSearch}
                  fetching={fetching}
                  items={persons}
                  delay={1000}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

PersonAddForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default PersonAddForm;