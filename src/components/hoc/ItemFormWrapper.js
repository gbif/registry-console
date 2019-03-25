import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import withWidth, { MEDIUM } from './Width';

const ItemFormWrapper = ({ visible, title, mode, children, width, closable, maskClosable, onCancel }) => {
  return (
    <React.Fragment>
      {mode === 'create' ? (visible && children) : (
        <Modal
          visible={visible}
          title={title}
          destroyOnClose={true}
          maskClosable={maskClosable}
          closable={closable}
          footer={null}
          width={width > MEDIUM ? '675px' : 'auto'}
          onCancel={onCancel}
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
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  closable: PropTypes.bool,
  maskClosable: PropTypes.bool,
  onCancel: PropTypes.func
};

ItemFormWrapper.defaultProps = {
  closable: false,
  maskClosable: false
};

export default withWidth()(ItemFormWrapper);