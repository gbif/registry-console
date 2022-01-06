import React from 'react';
import Suggest from './Suggest';
import { getDatasetSuggestions, getDataset } from '../../../api/dataset';
import { injectIntl } from 'react-intl';
// Wrappers
import withContext from '../../hoc/withContext';

export class DatasetSuggestWithoutContext extends React.Component {
  handleDatasetSearch = async value => {
    const response = await getDatasetSuggestions({ q: value });
    return { data: response.data };
  };

  render() {
    const { intl } = this.props;
    
    const placeholder = intl ? intl.formatMessage({
      id: 'select.dataset',
      defaultMessage: 'Select a dataset'
    }) : 'Select a dataset';

    return <Suggest
      placeholder={placeholder}
      search={this.handleDatasetSearch}
      resolveKey={getDataset}
      delay={200}
      titleField='title'
      {...this.props}
    />
  }
};

class DatasetSuggest extends React.Component {
  render() {
    return <DatasetSuggestWithoutContext {...this.props} />
  }
}
const mapContextToProps = ({ user }) => ({ user });
export default withContext(mapContextToProps)(injectIntl(DatasetSuggest)); 

