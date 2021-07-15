import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
import _isEqual from 'lodash/isEqual';
import _pickBy from 'lodash/pickBy';
import _identity from 'lodash/identity';

class DataQuery extends React.Component {
  constructor(props) {
    super(props);

    this.fetchData = this.fetchData.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.cancelPromise = this.cancelPromise.bind(this);
    this.getData = this.getData.bind(this)
    const query = this.getSearchParams();

    this.state = {
      query,
      data: {},
      loading: true,
      error: false,
      updateQuery: this.updateQuery,
      fetchData: this.fetchData,
      forceUpdate: this.getData
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    // Setting default query params
    this.getData(this.state.query);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Working with the case when user goes back/forward in browser history
    // using back/forward buttons of browser or mouse
    if (!_isEqual(this.props.location, prevProps.location)) {
      const query = this.getSearchParams();
      this.setState({ query }, () => {
        this.getData(query);
      });
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
    this.cancelPromise();
  }

  getSearchParams() {
    const query = qs.parse(this.props.location.search.slice(1));
    return query;
  }

  updateQuery(query) {
    this.setState({ query });
  }

  cancelPromise() {
    if (this.axiosPromise && typeof this.axiosPromise.cancel === 'function') {
      this.axiosPromise.cancel();
    }
  }

  fetchData(query = this.state.query) {
    this.updateSearchParams(query);
  }

  getData(query = this.state.query) {
    if (this.state.loading) {
      this.cancelPromise();
    }
    this.setState({
      loading: true,
      error: false,
      query: {...query}
    });

    const { type, ...apiQuery } = query;
    this.axiosPromise = this.props.api({ ...this.props.initQuery, ...apiQuery}, { type });

    this.axiosPromise.then(resp => {
      const data = resp.data;
      this.setState({
        data,
        loading: false,
        error: false
      });
    })
      .catch(err => {
        // Important for us due to the case of requests cancellation on unmount
        // Because in that case the request will be marked as cancelled=failed
        // and catch statement will try to update a state of unmounted component
        // which will throw an exception
        if (this._isMount && !err.__CANCEL__) {
          this.setState({
            error: true,
            loading: false
          });
        }
      });
  }

  /**
   * Updating route search parameters
   * @JSON query - how to filter the search
   */
  updateSearchParams(query) {
    const current = this.getSearchParams();
    const qString = qs.stringify(_pickBy(query, _identity));
    
    if (!_isEqual(current, qString)) {
      this.props.history.push({
        pathname: this.props.history.location.pathname,
        search: qString
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.render({...this.state})}
      </React.Fragment>
    );
  }
}

DataQuery.propTypes = {
  api: PropTypes.func.isRequired,
  initQuery: PropTypes.object.isRequired
};

export default withRouter(DataQuery);
