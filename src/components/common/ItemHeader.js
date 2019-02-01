import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { injectIntl } from 'react-intl';
import { Col, Icon, Row, Skeleton, Tooltip } from 'antd';
import DocumentTitle from 'react-document-title';

// Components
import BreadCrumbs from './BreadCrumbs';

const styles = theme => ({
  container: {
    width: '100%'
  },
  containerPaper: {
    width: '100%',
    maxWidth: theme.paperWidth,
    margin: '0 auto'
  },
  header: {
    background: '#fff',
    marginBottom: '16px',
    marginRight: '-16px',
    marginLeft: '-16px',
    alignItems: 'center',
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
  },
  icon: {
    margin: '0 5px',
    color: 'rgba(0,0,0,.45)'
  },
  buttonContainer: {
    textAlign: 'right'
  }
});

/**
 * Component responsible for a header display
 * Contains: breadcrumbs, item title/item type, can display additional wrapped content
 * @param listType - list type (for example, [organizations, deleted])
 * @param title - title of an item
 * @param listTitle - title of an item list
 * @param pageTitle - information which should be displayed as <title></title>
 * @param helpText - a help text hidden behind an icon with a question mark
 * @param submenu - subtype of an item (contact...comments)
 * @param status - status of item request from details page
 * @param loading - data loading indicator for breadcrumbs, indicates whether to show skeleton or data
 * @param usePaperWidth - Should the header fit screen or keep a standard paper maximum width. Default: false;
 * @param children - wrapped content
 * @param intl - passed from injectIntl wrapper, localization object
 * @param classes - passed from injectSheet wrapper, CSS styles from styles object above
 * @returns {*}
 * @constructor
 */
const ItemHeader = ({ listType, title, listTitle, pageTitle, helpText, submenu, status, loading, usePaperWidth, children, intl, classes }) => {
  // Value to the page title tag
  // Could be provided as an Intl object or as a String
  let preparedPageTitle = typeof pageTitle === 'string' ? pageTitle : intl.formatMessage(pageTitle);

  /**
   * Preparing component
   * Show nothing in the case of 404/500/523 exceptions
   * @returns {*}
   */
  const getHeader = () => {
    if (status === 404 || status === 500 || status === 523) {
      return null;
    }

    return (
      <DocumentTitle title={preparedPageTitle}>
        <Row className={classes.header} type="flex">
          <div className={usePaperWidth ? classes.containerPaper : classes.container}>
            <Skeleton className={classes.skeleton} loading={loading} active paragraph={{ rows: 1, width: '50%' }}>
              <Col xs={24} sm={24} md={18}>
                <BreadCrumbs listType={listType} title={title} submenu={submenu}/>
                <h1>
                  {title || listTitle}
                  {helpText && (
                    <Tooltip title={helpText}>
                      <Icon type="question-circle-o" className={classes.icon}/>
                    </Tooltip>
                  )}
                </h1>
              </Col>
              <Col xs={24} sm={24} md={6} className={classes.buttonContainer}>
                {children}
              </Col>
            </Skeleton>
          </div>
        </Row>
      </DocumentTitle>
    );
  };

  return getHeader();
};

ItemHeader.propTypes = {
  listType: PropTypes.array.isRequired,
  pageTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  listTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  submenu: PropTypes.string,
  status: PropTypes.number,
  loading: PropTypes.bool
};

export default injectSheet(styles)(injectIntl(ItemHeader));