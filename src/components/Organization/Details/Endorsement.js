import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Select } from "antd";
import PropTypes from "prop-types";
import { HasAccess } from "../../auth";
import withContext from "../../hoc/withContext";
import { setOrganizationEndorsementStatus, canSetOrganizationEndorsementStatus } from "../../../api/organization";

const { Option } = Select;

const ENDORSEMENT_STATE = [
  "ENDORSED",
  "REJECTED",
  "WAITING_FOR_ENDORSEMENT",
  "ON_HOLD",
];

class Endorsement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      loading: false,
    };
  }

  setOrganizationEndorsementStatus = async (status) => {
    const { organization, addError, refresh } = this.props;
    this.setState({ loading: true });
    try {
      await setOrganizationEndorsementStatus(organization.key, status);
      refresh();
    } catch (error) {
      this.setState({ loading: false });
      addError({
        status: error.response.status,
        statusText: error.response.data,
      });
    }
  };

  render() {
    const { disabled, loading } = this.state;
    const { organization } = this.props;

    return (
      <HasAccess fn={() => canSetOrganizationEndorsementStatus(organization.key)} noAccess={<FormattedMessage
        id={`endorsementStatus.${organization.endorsementStatus}`}
        defaultMessage="Endorsement status"
      />}>
        <span>
          <Select
            loading={loading}
            disabled={disabled}
            value={organization.endorsementStatus}
            style={{ width: "200px", marginRight: "10px" }}
            onChange={this.setOrganizationEndorsementStatus}
          >
            {ENDORSEMENT_STATE.map((o) => (
              <Option key={o} value={o}>
                <FormattedMessage
                  id={`endorsementStatus.${o}`}
                  defaultMessage={o}
                />
              </Option>
            ))}
          </Select>
          <LegacyIcon
            type={disabled ? "lock" : "unlock"}
            onClick={() => this.setState({ disabled: !disabled })}
          />
        </span>
      </HasAccess>
    );
  }
}
Endorsement.propTypes = {
  organization: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
};

const mapContextToProps = ({ addError, user }) => ({ addError, user });

export default withContext(mapContextToProps)(injectIntl(Endorsement));
