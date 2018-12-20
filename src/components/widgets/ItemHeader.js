import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { injectIntl } from 'react-intl';
import { Col, Row } from 'antd';
import DocumentTitle from 'react-document-title';

import BreadCrumbs from './BreadCrumbs';

const styles = {
  header: {
    background: '#fff',
    marginBottom: '16px',
    marginLeft: '-16px',
    width: 'calc(100% + 32px)',
    minHeight: '87px',
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
        <Col md={20} sm={24}>
          <BreadCrumbs listType={props.listType} title={props.title} submenu={props.submenu}/>
          <h1>{props.title}</h1>
        </Col>
        <Col md={4} sm={24} className="text-right">
          {props.children}
        </Col>
      </Row>
    </DocumentTitle>
  );
};

ItemHeader.propTypes = {
  listType: PropTypes.array.isRequired,
  pageTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  title: PropTypes.string,
  submenu: PropTypes.string
};

export default injectSheet(styles)(injectIntl(ItemHeader));