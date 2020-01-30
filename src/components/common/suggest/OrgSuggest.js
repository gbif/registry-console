import React from 'react';
import Suggest from './Suggest';
import { getOrgSuggestions, getOrganization } from '../../../api/organization';
import { FormattedMessage, injectIntl } from 'react-intl';
// Wrappers
import withContext from '../../hoc/withContext';
// Helpers
import { getPermittedOrganizations } from '../../util/helpers';

class OrgSuggest extends React.Component {
  handleOrganizationSearch = async value => {
    const { restrictOptions = false } = this.props;
    const response = await getOrgSuggestions({ q: value });
    const permittedOrganizations = restrictOptions ? getPermittedOrganizations(this.props.user, response.data) : response.data;
    return { data: permittedOrganizations };
  };

  render() {
    return <Suggest
      placeholder={<FormattedMessage id="select.organization" defaultMessage="Select an organization" />}
      search={this.handleOrganizationSearch}
      resolveKey={getOrganization}
      delay={200}
      {...this.props}
    />
  }
}

const mapContextToProps = ({ user }) => ({ user });
export default withContext(mapContextToProps)(injectIntl(OrgSuggest));