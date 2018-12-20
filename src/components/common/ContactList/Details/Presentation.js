import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Badge, Form } from 'antd';
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

const ContactPresentation = ({ data, classes }) => {
  return (
    <React.Fragment>
      {data && (
        <div className={classes.modalPresentation}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="type" defaultMessage="Type"/>}
          >
            <FormattedMessage id={data.type}/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="primary" defaultMessage="Primary"/>}
          >
            <Badge status={data.primary ? 'success' : 'error'} text={`${data.primary}`} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="firstName" defaultMessage="First name"/>}
          >
            {data.firstName}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}
          >
            {data.lastName}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="position" defaultMessage="Position"/>}
          >
            {data.position}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="description" defaultMessage="Description"/>}
          >
            {data.description}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="email" defaultMessage="Email"/>}
          >
            {data.email}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="phone" defaultMessage="Phone"/>}
          >
            {data.phone}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}
          >
            {data.homepage ? data.homepage.map(((item, i) => (
              <a href={item} key={i} target="_blank" rel="noopener noreferrer">{item}</a>
            ))) : null}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="organization" defaultMessage="Organization"/>}
          >
            {data.organization}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="address" defaultMessage="Address"/>}
          >
            {data.address}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="city" defaultMessage="City"/>}
          >
            {data.city}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="province" defaultMessage="Province"/>}
          >
            {data.province}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="country" defaultMessage="Country"/>}
          >
            {data.country}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}
          >
            {data.postalCode}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="userId" defaultMessage="User ID"/>}
          >
            {data.userId}
          </FormItem>
        </div>
      )}
    </React.Fragment>
  );
};

export default injectSheet(styles)(ContactPresentation);