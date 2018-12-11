import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Modal, Button, Row } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import MachineTagCreateForm from './MachineTagCreateForm';

// TODO think about CSSinJS for styles
const formButton = {
  type: 'primary',
  ghost: true,
  style: {
    border: 'none',
    padding: 0,
    height: 'auto',
    boxShadow: 'none'
  }
};

class MachineTagList extends React.Component {
  state = {
    list: this.props.data || [],
    visible: false
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleDelete = item => {
    Modal.confirm({
      title: <FormattedMessage id="deleteTitle.machineTag" defaultMessage="Do you want to delete this machine tag?"/>,
      content: <FormattedMessage
        id="deleteMessage.machineTag"
        defaultMessage="Are you really want to delete machine tag?"
      />,
      onOk: () => this.deleteMachineTag(item),
      onCancel() {
      }
    });
  };

  deleteMachineTag = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteMachineTag(item.key).then(() => {
        // Updating endpoints list
        const { list } = this.state;
        this.setState({
          list: list.filter(el => el.key !== item.key)
        });
        this.props.update('machineTags', list.length - 1);

        resolve();
      }).catch(reject);
    }).catch(() => console.log('Oops errors!'));
  };

  handleSave = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.createMachineTag(values).then(response => {
        form.resetFields();

        const list = this.state.list;
        list.unshift({
          ...values,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName
        });
        this.props.update('machineTags', list.length);

        this.setState({
          visible: false,
          list
        });
      });
    });
  };

  render() {
    const { list, visible } = this.state;
    const user = this.props.user;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <h1><FormattedMessage id="organizationMachineTags" defaultMessage="Organization machine tags"/></h1>
          {user ?
            <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Button>
            : null}
        </Row>
        <p className="help">
          <small>
            <FormattedMessage
              id="orgMachineTagsInfo"
              defaultMessage="Machine tags are intended for applications to store information about an entity. A machine tag is essentially a name/value pair, that is categorised in a namespace. The 3 parts may be used as the application sees fit."
            />
          </small>
        </p>

        <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={item => (
            <List.Item actions={user ? [
              <Button htmlType="button" onClick={() => this.handleDelete(item)} {...formButton}>
                <FormattedMessage id="delete" defaultMessage="Delete"/>
              </Button>
            ] : []}>
              <Skeleton title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={
                    <React.Fragment>
                      <strong className="item-title">{item.name}</strong> = <strong
                      className="item-title">{item.value}</strong>
                      <div className="item-type" style={{ marginLeft: 0 }}>{item.namespace}</div>
                    </React.Fragment>
                  }
                  description={
                    <React.Fragment>
                      <FormattedMessage
                        id="createdByRow"
                        defaultMessage={`Created {date} by {author}`}
                        values={{ date: <FormattedRelative value={item.created}/>, author: item.createdBy }}
                      />
                    </React.Fragment>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
        />

        {visible && <MachineTagCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleSave}
        />}
      </React.Fragment>
    );
  }
}

MachineTagList.propTypes = {
  data: PropTypes.array.isRequired,
  createMachineTag: PropTypes.func.isRequired,
  deleteMachineTag: PropTypes.func.isRequired,
  user: PropTypes.object,
  update: PropTypes.func.isRequired
};

export default MachineTagList;