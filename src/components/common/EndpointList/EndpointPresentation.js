import React from 'react';
import { Button, Form, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import injectSheet from 'react-jss';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 18 }
  },
  style: {
    paddingBottom: 0,
    marginBottom: '5px',
    minHeight: '32px',
    width: '100%',
    clear: 'both'
  }
};
const styles = {
  modalPresentation: {
    paddingTop: '4px',
    '& .ant-form-item-label': {
      textAlign: 'left',
      lineHeight: 1
    },
    '& .ant-form-item-label label:after': {
      display: 'none'
    },
    '& .ant-form-item-control': {
      lineHeight: 1
    }
  }
};

const EndpointPresentation = ({ visible, onCancel, data, classes }) => (
  <Modal
    visible={visible}
    title={<FormattedMessage id="endpointDetails" defaultMessage="Endpoint details"/>}
    destroyOnClose={true}
    closable={false}
    footer={[
      <Button key="submit" onClick={onCancel}>
        <FormattedMessage id="close" defaultMessage="Close"/>
      </Button>
    ]}
    onCancel={onCancel}
  >
    <div className={classes.modalPresentation}>
      <FormItem
        {...formItemLayout}
        label={<FormattedMessage id="type" defaultMessage="Type"/>}
      >
        {data && data.type}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={<FormattedMessage id="url" defaultMessage="URL"/>}
      >
        {data && data.url}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={<FormattedMessage id="description" defaultMessage="Description"/>}
      >
        {data && data.description}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={<FormattedMessage id="machineTags" defaultMessage="Machine tags"/>}
      >
        {data && data.machineTags.length > 0 ? data.machineTags :
          <FormattedMessage id="noMachineTags" defaultMessage="No machine tags"/>}
      </FormItem>
    </div>
  </Modal>
);

export default injectSheet(styles)(EndpointPresentation);