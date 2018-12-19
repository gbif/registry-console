import React from 'react';
import injectSheet from 'react-jss';
import DocumentTitle from 'react-document-title';

import BreadCrumbs from './BreadCrumbs';
import { injectIntl } from 'react-intl';
import { Col, Row } from 'antd';

const styles = {
  header: {
    background: '#fff',
    marginBottom: '16px',
    marginLeft: '-16px',
    width: 'calc(100% + 32px)',
    height: '87px',
    padding: '12px 24px',
    '& h1': {
      marginBottom: 0
    }
  }
};

const ItemHeader = props => {
  const { pageTitle, intl } = props;
  // Value to the page title tag
  // Could be provided as an Intl object or as a String
  const title = typeof pageTitle === 'string' ? pageTitle : intl.formatMessage(pageTitle);

  return (
    <DocumentTitle title={title}>
      <Row className={props.classes.header}>
        <Col span={20}>
          <BreadCrumbs listType={props.listType} title={props.title} submenu={props.submenu}/>
          <h1>{props.title}</h1>
        </Col>
        <Col span={4} className="text-right">
          {props.children}
        </Col>
      </Row>
    </DocumentTitle>
  );
};

export default injectSheet(styles)(injectIntl(ItemHeader));