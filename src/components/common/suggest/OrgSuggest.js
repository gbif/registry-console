import React from 'react';
import Suggest from './Suggest';
import { getOrgSuggestions, getOrganization } from '../../../api/organization';
import { injectIntl } from 'react-intl';
// Wrappers
import withContext from '../../hoc/withContext';
// Helpers
import { getPermittedOrganizations } from '../../util/helpers';

export class OrgSuggestWithoutContext extends React.Component {
  handleOrganizationSearch = async value => {
    const { restrictOptions = false, user } = this.props;
    const response = await getOrgSuggestions({ q: value });
    const permittedOrganizations = restrictOptions ? getPermittedOrganizations(user, response.data) : response.data;
    return { data: permittedOrganizations };
  };

  render() {
    const { intl } = this.props;
    
    const placeholder = intl ? intl.formatMessage({
      id: 'select.organization',
      defaultMessage: 'Select an organization'
    }) : 'Select an organization';

    return <Suggest
      placeholder={placeholder}
      search={this.handleOrganizationSearch}
      resolveKey={getOrganization}
      delay={200}
      {...this.props}
    />
  }
};

class OrgSuggest extends React.Component {
  render() {
    return <OrgSuggestWithoutContext {...this.props} />
  }
}
const mapContextToProps = ({ user }) => ({ user });
export default withContext(mapContextToProps)(injectIntl(OrgSuggest)); 

