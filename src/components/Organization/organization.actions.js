import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Dropdown, Menu, Modal } from 'antd';
import injectSheet from 'react-jss';

// API
import { deleteOrganization, updateOrganization, retrievePassword, canRetrievePassword } from '../../api/organization';
import { canDelete } from '../../api/permissions';
// Wrappers
import { HasAccess } from '../auth';
// Components
import { ConfirmButton } from '../common';
import withContext from '../hoc/withContext';

const styles = {
  code: {
    padding: '2px 4px',
    color: '#d14',
    backgroundColor: '#f7f7f9',
    border: '1px solid #e1e1e8'
  },
  password: {
    marginTop: '10px',
    marginBottom: 0
  }
};

/**
 * Organization Actions component
 * Displays buttons depends on user's roles and scope, and item's state
 * @param uuids - active user UUID scope
 * @param organization - active item object
 * @param onChange - callback to invoke any parent process
 * @param intl - react-intl injected object responsible for localization
 * @param user - active user object from context
 * @param classes - react-jss object responsible for styles
 * @returns {*}
 * @constructor
 */
const OrganizationActions = ({ uuids, organization, onChange, intl, user, classes }) => {
  const callConfirmWindow = actionType => {
    let title;

    switch (actionType) {
      case 'delete': {
        title = intl.formatMessage({
          id: 'delete.confirmation.organization',
          defaultMessage: 'Are you sure to delete this organization?'
        });
        break;
      }
      case 'restore': {
        title = intl.formatMessage({
          id: 'restore.confirmation',
          defaultMessage: 'Restoring a previously deleted entity will likely trigger significant processing'
        });
        break;
      }
      default:
        break;
    }

    if (title) {
      showConfirm(title, actionType);
    }
  };

  const showConfirm = (title, actionType) => {
    Modal.confirm({
      title,
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk: () => callAction(actionType)
    });
  };

  const callAction = actionType => {
    switch (actionType) {
      case 'delete':
        deleteItem();
        break;
      case 'restore':
        restoreItem();
        break;
      default:
        break;
    }
  };

  const retrieve = () => {
    retrievePassword(organization.key).then(response => {
      Modal.info({
        content: <FormattedMessage
          id='organization.retrievePassword.message'
          defaultMessage='The password is only for use with the IPT (the GBRDS API), registering datasets using new API ({api}) requires a user with {role} permission and an entry in the {table} table. {password}'
          values={{
            api: <code className={classes.code}>api.gbif.org</code>,
            role: <code className={classes.code}>REGISTRY_EDITOR</code>,
            table: <code className={classes.code}>editor_rights</code>,
            password: <p className={classes.password}>{response.data}</p>
          }}
        />
      });
    });
  };

  const restoreItem = () => {
    delete organization.deleted;

    updateOrganization(organization).then(() => onChange()).catch(onChange);
  };

  const deleteItem = () => {
    deleteOrganization(organization.key).then(() => onChange()).catch(onChange);
  };

  const renderActionMenu = () => {
    return <Menu onClick={event => callConfirmWindow(event.key)}>
        {organization.deleted && (
          <Menu.Item key="restore">
            <FormattedMessage id="restore.organization" defaultMessage="Restore this organization" />
          </Menu.Item>
        )}
        {!organization.deleted && (
          <Menu.Item key="delete">
            <FormattedMessage id="delete.organization" defaultMessage="Delete this organization" />
          </Menu.Item>
        )}
    </Menu>
  };

  return (
    <React.Fragment>
        <HasAccess fn={() => canRetrievePassword(organization.key)} noAccess={<>
          <HasAccess fn={() => canDelete('organization', organization.key)}>
            {organization.deleted ? (
              <ConfirmButton
                title={
                  <FormattedMessage
                    id="restore.confirmation"
                    defaultMessage="Restoring a previously deleted entity will likely trigger significant processing"
                  />
                }
                btnText={<FormattedMessage id="restore.organization" defaultMessage="Restore this organization" />}
                onConfirm={restoreItem}
              />
            ) : (
                <ConfirmButton
                  title={
                    <FormattedMessage
                      id="delete.confirmation.organization"
                      defaultMessage="Are you sure to delete this organization?"
                    />
                  }
                  btnText={<FormattedMessage id="delete.organization" defaultMessage="Delete this organization" />}
                  onConfirm={deleteItem}
                />
              )}
          </HasAccess>
        </>}>
          <Dropdown.Button onClick={retrieve} overlay={renderActionMenu()}>
            <FormattedMessage id="organization.retrievePassword" defaultMessage="Retrieve password" />
          </Dropdown.Button>
        </HasAccess>
      </React.Fragment >
  );
};

OrganizationActions.propTypes = {
        uuids: PropTypes.array.isRequired,
  organization: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  user: PropTypes.object,
  classes: PropTypes.object.isRequired
};

const mapContextToProps = ({user}) => ({user});

export default withContext(mapContextToProps)(injectIntl(injectSheet(styles)(OrganizationActions)));