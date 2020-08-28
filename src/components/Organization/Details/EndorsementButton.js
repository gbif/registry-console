import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button } from "antd";
import PropTypes from "prop-types";
import get from "lodash/get";
import { hasRole } from "../../auth";
import withContext from "../../hoc/withContext";
import { hasEndorsementRight } from "../../../api/user";
import {
  endorseOrganization,
  removeOrganizationEndorsement,
} from "../../../api/organization";

class EndorsementButton extends Component {
  constructor(props) {
    super(props);
    const { user } = props;
    this.state = {
      userHasEndorsementRights: hasRole(user, "REGISTRY_ADMIN"),
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.getUserEndorsementRights();
    }
  }

  componentDidUpdate = (prevProps) => {
    if (
      get(prevProps, "organization.key") !== get(this.props, "organization.key")
    ) {
      this.setState(
        { userHasEndorsementRights: false },
        this.getUserEndorsementRights
      );
    }
    if (get(prevProps, "user.userName") !== get(this.props, "user.userName")) {
      this.setState(
        { userHasEndorsementRights: false },
        this.getUserEndorsementRights
      );
    }
  };

  getUserEndorsementRights = async () => {
    const { user, organization } = this.props;
    // No need to call the service if it an admin
    if (hasRole(user, "REGISTRY_ADMIN")) {
      this.setState({ userHasEndorsementRights: true });
    } else {
      try {
        await hasEndorsementRight(user.userName, organization.key);
        // Response gave status 2XX
        this.setState({ userHasEndorsementRights: true });
      } catch (err) {
        // Response gave status 4XX (no endorsement righht) or 5XX
        this.setState({ userHasEndorsementRights: false });
      }
    }
  };

  endorseOrganization = async () => {
    const { organization, addError, refresh } = this.props;
    try {
      await endorseOrganization(organization.key);
      refresh();
    } catch (error) {
      console.log(error);

      addError({
        status: error.response.status,
        statusText: error.response.data,
      });
    }
  };

  removeEndorsement = async () => {
    const { organization, addError, refresh } = this.props;
    try {
      await removeOrganizationEndorsement(organization.key);
      refresh();
    } catch (error) {
      console.log(error);
      addError({
        status: error.response.status,
        statusText: error.response.data,
      });
    }
  };

  render() {
    const { userHasEndorsementRights } = this.state;
    const {
      organization: { endorsementStatus },
    } = this.props;
    if (!userHasEndorsementRights) {
      return null;
    } else if (endorsementStatus !== "ENDORSED") {
      return (
        <Button
          style={{ marginLeft: "10px", display: "inline-block" }}
          size="small"
          type="primary"
          onClick={this.endorseOrganization}
        >
          <FormattedMessage id="endorsement.endorse" defaultMessage="Endorse" />
        </Button>
      );
    } else {
      return (
        <Button
          style={{ marginLeft: "10px", display: "inline-block" }}
          size="small"
          type="danger"
          onClick={this.removeEndorsement}
        >
          <FormattedMessage
            id="endorsement.removeEndorsement"
            defaultMessage="Remove endorsement"
          />
        </Button>
      );
    }
  }
}
EndorsementButton.propTypes = {
  organization: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
};

const mapContextToProps = ({ addError, user }) => ({ addError, user });

export default withContext(mapContextToProps)(injectIntl(EndorsementButton));
