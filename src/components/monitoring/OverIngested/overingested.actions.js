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

const OverIngestedActions = ({ width, classes, intl }) => {
  const showModal = () => {
    Modal.info({
      content: (
        <div>
          <h1>
            {intl.formatMessage({ id: 'overingested.abount.title', defaultMessage: 'About this tool' })}
          </h1>
          <p dangerouslySetInnerHTML={{ __html: intl.formatHTMLMessage({ id: 'overingested.abount.p1', defaultMessage: 'The overcrawl monitor helps spot datasets that might be overcrawled. <strong>Be aware that the data in the table is only updated once a day</strong> and that is <strong>only shows DwC-A dataset crawls</strong> currently.' }) }}/>
          <h2>
            {intl.formatMessage({ id: 'overingested.abount.subtitle', defaultMessage: 'How it works' })}
          </h2>
          <p dangerouslySetInnerHTML={{ __html: intl.formatHTMLMessage({ id: 'overingested.abount.p2', defaultMessage: 'When a dataset is crawled all occurrence records created, updated or seen to be without change will be updated with the current crawl ID. Once a day a service inspects the index and identifies datasets with records within that dataset with a crawlID differing to the most recent crawl.  Under normal working conditions, all records should have the most recent crawl ID and any remaining should be deleted.  This will happen automatically up to a threshold.  The monitor shows all those remaining that ahve been identified as not meeting the conditions to be deleted automatically and <strong>need administrator attention</strong>.' }) }}/>
          <p dangerouslySetInnerHTML={{ __html: intl.formatHTMLMessage({ id: 'overingested.abount.p3', defaultMessage: 'It should be the case that this console shows no rows of data if all datasets are in sync.  <strong>This is the goal</strong>.' }) }}/>
          <ul>
            <li>
              {intl.formatMessage({ id: 'overingested.abount.list.1', defaultMessage: 'GBIF count: how many records are in the GBIF index from this dataset.' })}
            </li>
            <li>
              {intl.formatMessage({ id: 'overingested.abount.list.2', defaultMessage: 'Last crawl count: how many records was provided in the last crawl of the dataset.' })}
            </li>
            <li>
              {intl.formatMessage({ id: 'overingested.abount.list.3', defaultMessage: 'Off by: how many percentage of teh dataset would be deleted if we deleted everything but the last crawl.' })}
            </li>
            <li>
              {intl.formatMessage({ id: 'overingested.abount.list.4', defaultMessage: 'Last crawl id: how many times have this dataset been crawled.' })}
            </li>
            <li>
              {intl.formatMessage({ id: 'overingested.abount.list.5', defaultMessage: 'Histogram: number of occurrences for different crawl IDs' })}
            </li>
          </ul>
        </div>
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

export default withWidth()(injectSheet(styles)(injectIntl(OverIngestedActions)));