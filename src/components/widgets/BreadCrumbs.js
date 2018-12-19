import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import PropTypes from 'prop-types';

class BreadCrumbs extends Component {
  render() {
    const { listType, title, submenu } = this.props;

    return (
      <Breadcrumb>
        {listType && listType.map((crumb, i) => (<Breadcrumb.Item key={i}>{crumb}</Breadcrumb.Item>))}
        {title && <Breadcrumb.Item>{title}</Breadcrumb.Item>}
        {title && submenu && <Breadcrumb.Item>{submenu}</Breadcrumb.Item>}
      </Breadcrumb>
    );
  }
}

BreadCrumbs.propTypes = {
  listType: PropTypes.array.isRequired,
  title: PropTypes.string,
  submenu: PropTypes.string
};

export default BreadCrumbs;