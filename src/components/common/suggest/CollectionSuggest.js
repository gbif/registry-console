import React from 'react';
import Suggest from './Suggest';
import { getSuggestedCollections, getCollection } from '../../../api/collection';
import { injectIntl } from 'react-intl';
// Wrappers
import withContext from '../../hoc/withContext';

export class CollectionSuggestWithoutContext extends React.Component {
  handleOrganizationSearch = async value => {
    const hiddenEntries = this.props.hiddenEntries || [];
    const response = await getSuggestedCollections({ q: value });
    return { data: response.data.filter(x => hiddenEntries.indexOf(x.key) === -1) };
  };

  render() {
    const { intl } = this.props;
    
    const placeholder = intl ? intl.formatMessage({
      id: 'select.collection',
      defaultMessage: 'Select an collection'
    }) : 'Select an collection';

    return <Suggest
      placeholder={placeholder}
      search={this.handleOrganizationSearch}
      resolveKey={getCollection}
      delay={200}
      titleField='name'
      {...this.props}
    />
  }
};

class CollectionSuggest extends React.Component {
  render() {
    return <CollectionSuggestWithoutContext {...this.props} />
  }
}
const mapContextToProps = ({ user }) => ({ user });
export default withContext(mapContextToProps)(injectIntl(CollectionSuggest)); 

