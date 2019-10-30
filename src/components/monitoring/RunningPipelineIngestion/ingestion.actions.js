import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import injectSheet from 'react-jss';
import withWidth, { MEDIUM } from '../../hoc/Width';

const styles = {
  modal: {
    '& i': {
      display: 'none'
    },
    '& .ant-modal-confirm-content': {
      marginLeft: 0
    }
  }
};

const IngestionActions = ({ width, classes, intl }) => {
  const showModal = () => {
    Modal.info({
      content: (
        <div dangerouslySetInnerHTML={{
          __html: intl.formatHTMLMessage({
            id: 'ingestion.about',
            defaultMessage: '<h1>About the dataset ingestion monitor</h1>\n<p>This tool provides an overview of which datasets are currently being ingested into GBIF\'s data store. It is primarily intended for technical users that understand the GBIF ingestion procedures. Toggle the help for an explanation of the column headings.</p>\n'
          })
        }}/>
      ),
      width: width > MEDIUM ? '624px' : 'auto',
      className: classes.modal
    });
  };

  return (
    <div>
      <Button htmlType="button" type="primary" onClick={showModal}>
        <FormattedMessage id="about" defaultMessage="About"/>
      </Button>
    </div>
  );
};

export default withWidth()(injectSheet(styles)(injectIntl(IngestionActions)));