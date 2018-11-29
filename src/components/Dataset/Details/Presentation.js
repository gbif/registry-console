import React, { Component } from "react"
import { FormattedMessage } from 'react-intl'
import PresentationItem from '../../PresentationItem'

class DatasetPresentation extends Component {
  render() {
    const { dataset } = this.props;
    return (
      <div>
        {dataset &&
          <dl>
            <PresentationItem label={<FormattedMessage id="title" defaultMessage="Title" />} >
              {dataset.title}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="datasetType" defaultMessage="Dataset type" />} >
              {dataset.type}
            </PresentationItem>
            <PresentationItem label={<FormattedMessage id="doi" defaultMessage="DOI" />} >
              {dataset.doi}
            </PresentationItem>
          </dl>
        }
      </div>
    );
  }
}

export default DatasetPresentation