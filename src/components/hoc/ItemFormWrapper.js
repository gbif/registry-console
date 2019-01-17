import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const ItemFormWrapper = ({ visible, title, mode, children }) => {
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

export default ItemFormWrapper;