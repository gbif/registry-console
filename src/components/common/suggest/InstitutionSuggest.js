import React from 'react';
import Suggest from './Suggest';
import { getSuggestedInstitutions, getInstitution } from '../../../api/institution';
import { injectIntl } from 'react-intl';
// Wrappers
import withContext from '../../hoc/withContext';

export class InstitutionSuggestWithoutContext extends React.Component {
  handleOrganizationSearch = async value => {
    const hiddenEntries = this.props.hiddenEntries || [];
    const response = await getSuggestedInstitutions({ q: value });
    return { data: response.data.filter(x => hiddenEntries.indexOf(x.key) === -1) };
  };

  render() {
    const { intl } = this.props;
    
    const placeholder = intl ? intl.formatMessage({
      id: 'select.institution',
      defaultMessage: 'Select an institution'
    }) : 'Select an institution';

    return <Suggest
      placeholder={placeholder}
      search={this.handleOrganizationSearch}
      resolveKey={getInstitution}
      delay={200}
      titleField='name'
      {...this.props}
    />
  }
};

class InstitutionSuggest extends React.Component {
  render() {
    return <InstitutionSuggestWithoutContext {...this.props} />
  }
}
const mapContextToProps = ({ user }) => ({ user });
export default withContext(mapContextToProps)(injectIntl(InstitutionSuggest)); 

