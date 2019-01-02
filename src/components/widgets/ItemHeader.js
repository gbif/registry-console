import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { injectIntl } from 'react-intl';
import { Col, Icon, Row, Skeleton, Tooltip } from 'antd';
import DocumentTitle from 'react-document-title';

// Components
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
  },
  skeleton: {
    '& h3': {
      marginTop: '6px !important',
      height: '14px !important',
      width: '43% !important'
    },
    '& ul': {
      padding: 0,
      marginTop: '10px !important',
      marginBottom: 0,
      '& li': {
        height: '28px !important'
      }
    }
  }
};

/**
 * Component responsible for a header display
 * Contains: breadcrumbs, item title/item type, can display additional wrapped content
 * @param listType - list type (for example, [organizations, deleted])
 * @param title - title of an item
 * @param listTitle - title of an item list
 * @param pageTitle - information which should be displayed as <title></title>
 * @param helpText - a help text hidden behind an icon with a question mark
 * @param submenu - subtype of an item (contact...comments)
 * @param loading - data loading indicator for breadcrumbs, indicates whether to show skeleton or data
 * @param children - wrapped content
 * @param intl - passed from injectIntl wrapper, localization object
 * @param classes - passed from injectSheet wrapper, CSS styles from styles object above
 * @returns {*}
 * @constructor
 */
const ItemHeader = ({ listType, title, listTitle, pageTitle, helpText, submenu, loading, children, intl, classes }) => {
  // Value to the page title tag
  // Could be provided as an Intl object or as a String
  const preparedPageTitle = typeof pageTitle === 'string' ? pageTitle : intl.formatMessage(pageTitle);

  return (
    <DocumentTitle title={preparedPageTitle}>
      <Row className={classes.header}>
        <Skeleton className={classes.skeleton} loading={loading} active paragraph={{ rows: 1, width: '50%' }}>
          <Col md={20} sm={24}>
            <BreadCrumbs listType={listType} title={title} submenu={submenu}/>
            <h1>
              {title || listTitle}
              {helpText && (
                <Tooltip title={helpText}>
                  <Icon type="question-circle-o"/>
                </Tooltip>
              )}
            </h1>
          </Col>
          <Col md={4} sm={24} className='text-right'>
            {children}
          </Col>
        </Skeleton>
      </Row>
    </DocumentTitle>
  );
};

ItemHeader.propTypes = {
  listType: PropTypes.array.isRequired,
  pageTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  listTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  submenu: PropTypes.string,
  loading: PropTypes.bool
};

export default injectSheet(styles)(injectIntl(ItemHeader));