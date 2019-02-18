import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
import _isEqual from 'lodash/isEqual';

class DataQuery extends React.Component {
  constructor(props) {
    super(props);

    this.fetchData = this.fetchData.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.cancelPromise = this.cancelPromise.bind(this);

    this.state = {
      query: props.initQuery,
      searchValue: '',
      data: {},
      loading: true,
      error: false,
      updateQuery: this.updateQuery,
      fetchData: this.fetchData,
      filter: { type: '' }
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    // Setting default query params
    // Parsing route search params
    const search = this.getSearchParams();
    const filter = this.getFilter();

    if (this.props.location.search) {
      this.setState(state => {
        return {
          query: { ...state.query, ...search },
          searchValue: search.q,
          filter
        };
      }, () => {
        this.fetchData(this.state.query, this.state.filter);
      });
    } else {
      this.fetchData(this.state.query, this.state.filter);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Working with the case when user goes back/forward in browser history
    // using back/forward buttons of browser or mouse
    if (!_isEqual(this.props.location, prevProps.location)) {
      const search = this.getSearchParams();
      const filter = this.getFilter();
      const currentQuery = { ...this.props.initQuery, ...search };
      // Updating query and fetching data ONLY if user hasn't done it via pagination controls
      // or search field
      if (!_isEqual(this.state.query, currentQuery) || !_isEqual(this.state.filter, filter)) {
          this.setState(() => {
            return {
              query: { ...this.props.initQuery, ...search },
              searchValue: search.q,
              filter
            };
          }, () => {
            this.fetchData(this.state.query, this.state.filter);
          });
      }
    }
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
    this.cancelPromise();
  }

  getSearchParams() {
    const search = qs.parse(this.props.location.search.slice(1));
    if (search.offset) {
      search.offset = +search.offset;
    }
    // Removing filter avoiding duplicates
    delete search.type;

    return search;
  }

  getFilter() {
    const search = qs.parse(this.props.location.search.slice(1));

    return { type: search.type };
  }

  updateQuery(query) {
    this.setState({
      query: { ...this.props.initQuery, ...query }
    });
  }

  cancelPromise() {
    if (this.axiosPromise && typeof this.axiosPromise.cancel === 'function') {
      this.axiosPromise.cancel();
    }
  }

  fetchData(query, filter = this.state.filter) {
    // Fixing query parameters if a user set them manually and they are not valid for us
    this.normalizeQuery(query);
    const normalizedFilter = this.getNormalizedFilter(filter);
    this.updateSearchParams(query, normalizedFilter);
    if (this.state.loading) {
      this.cancelPromise();
    }
    this.setState({
      loading: true,
      error: false,
      filter: normalizedFilter
    });

    this.axiosPromise = this.props.api({ ...this.state.query, ...query }, normalizedFilter);

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
   * @param q - a string from search field
   * @param offset - offset number, depends on selected page
   * @param type - filter parameter which indicates item type
   */
  updateSearchParams({ q, offset }, { type }) {
    const query = [];

    if (q) {
      query.push(`q=${q}`);
    }
    if (offset) {
      query.push(`offset=${offset}`);
    }
    if (type) {
      query.push(`type=${type}`);
    }

    const search = query.length > 0 ? `?${query.join('&')}` : '';

    if (this.props.location.search !== search) {
      this.setState(state => {
        return {
          searchValue: q,
          query: search === '' ? this.props.initQuery : { ...state.query, q, offset }
        };
      }, () => {
        this.props.history.push(search || this.props.history.location.pathname);
      });
    }
  }

  normalizeQuery(query) {
    const { initQuery } = this.props;
    const limit = initQuery.limit || 25;

    if (query.offset) {
      query.offset = Math.ceil(query.offset / limit) * limit;
    }
  }

  getNormalizedFilter(filter) {
    if (filter && filter.hasOwnProperty('type')) {
      return filter;
    }

    if (filter && Object.keys(filter).length > 0) {
      return { type: Object.values(filter)[0][0] };
    }

    return { type: '' };
  }

  render() {
    return (
      <React.Fragment>
        {this.props.render(this.state)}
      </React.Fragment>
    );
  }
}

DataQuery.propTypes = {
  api: PropTypes.func.isRequired,
  initQuery: PropTypes.object.isRequired
};

export default withRouter(DataQuery);
