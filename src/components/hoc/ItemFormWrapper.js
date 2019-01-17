import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import withWidth, { MEDIUM } from './Width';

const ItemFormWrapper = ({ visible, title, mode, children, width }) => {
  return (
    <React.Fragment>
      {mode === 'create' ? (visible && children) : (
        <Modal
          visible={visible}
          title={title}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
          footer={null}
          width={width > MEDIUM ? '600px' : 'auto'}
        >
          {children}
        </Modal>
      )}
    </React.Fragment>
  );
};

ItemFormWrapper.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  mode: PropTypes.oneOf(['create', 'edit']).isRequired
};

export default withWidth()(ItemFormWrapper);