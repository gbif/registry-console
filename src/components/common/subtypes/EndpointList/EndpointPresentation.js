import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// Components
import PresentationItem from '../../PresentationItem';
import MachineTags from '../../MachineTags';

const EndpointPresentation = ({ visible, onCancel, endpoint }) => (
  <Modal
    visible={visible}
    title={<FormattedMessage id="endpointDetails" defaultMessage="Endpoint details"/>}
    destroyOnClose={true}
    closable={false}
    footer={[
      <Button htmlType="button" key="submit" onClick={onCancel}>
        <FormattedMessage id="close" defaultMessage="Close"/>
      </Button>
    ]}
    onCancel={onCancel}
  >
    {endpoint && (
      <dl>
        <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
          {endpoint.type}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="url" defaultMessage="URL"/>}>
          { endpoint.url}
        </PresentationItem>
        <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
          {endpoint.description}
        </PresentationItem>
        <MachineTags tags={endpoint.machineTags}/>
      </dl>
    )}
  </Modal>
);

EndpointPresentation.propTypes = {
  visible: PropTypes.bool.isRequired,
  endpoint: PropTypes.object,
  onCancel: PropTypes.func.isRequired
};

export default EndpointPresentation;