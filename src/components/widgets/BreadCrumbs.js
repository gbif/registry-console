import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import withContext from '../hoc/withContext';

class BreadCrumbs extends Component {
  getKeys = () => {
    const { location } = this.props;

    return location.pathname.slice(1).split('/');
  };

  getFirstCrumb = () => {
    const keys = this.getKeys();

    return (
      <Breadcrumb.Item>
        <FormattedMessage id={`breadcrumb.list.${keys[0]}`} defaultMessage="List"/>
      </Breadcrumb.Item>
    );
  };

  getMainCrumb = () => {
    const { activeItem } = this.props;
    const keys = this.getKeys();

    if (this.isItemKey(keys[1])) {
      return (activeItem && activeItem.key === keys[1]) ? activeItem.title : null;
    } else if (keys[1] === 'create') {
      return <FormattedMessage id={`breadcrumb.new.${[keys[0]]}`}/>;
    } else if (keys[0] === 'user' && keys[1] !== 'search') {
      return activeItem ? activeItem.userName : null;
    } else {
      return <FormattedMessage id={`breadcrumb.${keys[0]}.${keys[1]}`} defaultMessage=""/>;
    }
  };

  getSubCrumb = () => {
    const keys = this.getKeys();

    if (keys.length > 2) {
      return (
        <Breadcrumb.Item>
          <FormattedMessage id={`breadcrumb.sub.${keys[keys.length - 1]}`}/>
        </Breadcrumb.Item>
      );
    }

    return null;
  };

  isItemKey = key => {
    return key.match(/[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/gm);
  };

  render() {
    // Actually, type of the list page
    const firstCrumb = this.getFirstCrumb();
    // It could be an item title, new item or one of the list pages
    const mainCrumb = this.getMainCrumb();
    // We should add subcategory on a details page
    const subCrumb = this.getSubCrumb();

    return (
      <Breadcrumb style={{ marginTop: '-8px', marginBottom: '8px' }}>
        {firstCrumb}
        <Breadcrumb.Item>{mainCrumb}</Breadcrumb.Item>
        {mainCrumb && subCrumb}
      </Breadcrumb>
    );
  }
}

BreadCrumbs.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool
};

const mapContextToProps = ({ activeItem }) => ({ activeItem });

export default withContext(mapContextToProps)(withRouter(BreadCrumbs));