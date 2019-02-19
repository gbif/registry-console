import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import PropTypes from 'prop-types';

/**
 * BreadCrumbs widget responsible only for displaying a list of given text keys
 *
 * - listType: an array with names of list page (ex. Organizations/Search)
 * - title: name of the item or "Create new..." text
 * - submenu: indicates subtype of the item (Contacts, Identifiers, etc.)
 */
class BreadCrumbs extends Component {
  render() {
    const { listType, title, submenu } = this.props;

    return (
      <Breadcrumb style={{ display: 'flex' }}>
        {listType && listType.map((crumb, i) => (<Breadcrumb.Item key={i}>{crumb}</Breadcrumb.Item>))}
        {title && <Breadcrumb.Item>{title}</Breadcrumb.Item>}
        {title && submenu && <Breadcrumb.Item>{submenu}</Breadcrumb.Item>}
      </Breadcrumb>
    );
  }
}

BreadCrumbs.propTypes = {
  listType: PropTypes.array.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  submenu: PropTypes.string
};

export default BreadCrumbs;