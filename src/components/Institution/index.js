import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';

import {
  getInstitution,
  updateContact,
  deleteContact,
  createContact,
  createIdentifier,
  deleteIdentifier,
  createTag,
  deleteTag
} from '../../api/grbio.institution';
import { ItemHeader, ItemMenu } from '../widgets';
import InstitutionDetails from './Details';
import { ContactList, IdentifierList, TagList } from '../common';
import Exception404 from '../exception/404';
import MenuConfig from './menu.config';
import withContext from '../hoc/withContext';
import { getSubMenu } from '../helpers';

class Institution extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: null,
      counts: {}
    };
  }

  componentDidMount() {
    if (this.props.match.params.key) {
      this.getData();
    } else {
      this.setState({
        data: null,
        loading: false
      });
    }
  }

  getData() {
    this.setState({ loading: true });

    getInstitution(this.props.match.params.key).then(response => {

      this.setState({
        data: response.data,
        loading: false,
        counts: {
          contacts: response.data.contacts.length,
          identifiers: response.data.identifiers.length,
          tags: response.data.tags.length
        }
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  }

  refresh = key => {
    if (key) {
      this.props.history.push(key);
    } else {
      this.getData();
    }
  };

  updateCounts = (key, value) => {
    this.setState(state => {
      return {
        counts: {
          ...state.counts,
          [key]: value
        }
      };
    });
  };

  render() {
    const { match, intl } = this.props;
    const key = match.params.key;
    const { data, loading, counts } = this.state;
    const listName = intl.formatMessage({ id: 'institutions', defaultMessage: 'Institutions' });
    const submenu = getSubMenu(this.props);
    const pageTitle = data || loading ?
      intl.formatMessage({ id: 'title.institution', defaultMessage: 'Institution | GBIF Registry' }) :
      intl.formatMessage({ id: 'title.newInstitution', defaultMessage: 'New institution | GBIF Registry' });
    let title = '';
    if (data) {
      title = data.name;
    } else if (!loading) {
      title = intl.formatMessage({ id: 'newInstitution', defaultMessage: 'New institution' });
    }

    return (
      <React.Fragment>
        <ItemHeader listType={[listName]} title={title} submenu={submenu} pageTitle={pageTitle}/>

        {!loading && <Route path="/:type?/:key?/:section?" render={() => (
          <ItemMenu counts={counts} config={MenuConfig} isNew={data === null}>
            <Switch>
              <Route exact path={`${match.path}`} render={() =>
                <InstitutionDetails
                  institution={data}
                  refresh={key => this.refresh(key)}
                />
              }/>

              <Route path={`${match.path}/contact`} render={() =>
                <ContactList
                  data={data}
                  createContact={data => createContact(key, data)}
                  updateContact={data => updateContact(key, data)}
                  deleteContact={itemKey => deleteContact(key, itemKey)}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/identifier`} render={() =>
                <IdentifierList
                  data={data}
                  createIdentifier={data => createIdentifier(key, data)}
                  deleteIdentifier={itemKey => deleteIdentifier(key, itemKey)}
                  update={this.updateCounts}
                />
              }/>

              <Route path={`${match.path}/tag`} render={() =>
                <TagList
                  data={data}
                  createTag={data => createTag(key, data)}
                  deleteTag={itemKey => deleteTag(key, itemKey)}
                  update={this.updateCounts}
                />
              }/>

              <Route component={Exception404}/>
            </Switch>
          </ItemMenu>
        )}
        />}

        {loading && <Spin size="large"/>}
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(withRouter(injectIntl(Institution)));