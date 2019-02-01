import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import injectSheet from 'react-jss';

import withWidth, { MEDIUM } from '../hoc/Width';

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

const SyncStateActions = ({ width, classes, intl }) => {
  const showModal = () => {
    Modal.info({
      content: (
        <div dangerouslySetInnerHTML={{
          __html: intl.formatHTMLMessage({
            id: 'syncState.about',
            defaultMessage: '<h1>About IPT sync states</h1><p>IPTs have a way of telling other machines how many occurrences they have per dataset. Be aware that this might require your IPT to be updated. See also <a href="https://github.com/gbif/ipt/issues/1344">IPT Bug 1344</a>.This tool compares the IPT inventory with the number of occurrences in the GBIF index. If the two don\'t align then you should investigate why the synchronisation fails or get in touch with the GBIF secretariat.</p>\n<h2>How to use it</h2>\n<p>Enter the URL of your ipt (e.g. <code>http://maerua.iict.pt/ipt</code>). If your ipt supports the <code>/inventory/dataset</code> call then you should see a list of datasets</p>\n'
          })
        }}/>
      ),
      width: width > MEDIUM ? '624px' : 'auto',
      className: classes.modal
    });
  };

  return (
    <div>
      <Button htmlType="button" type="primary" onClick={showModal} ghost={true}>
        <FormattedMessage id="about" defaultMessage="About"/>
      </Button>
    </div>
  );
};

export default withWidth()(injectSheet(styles)(injectIntl(SyncStateActions)));