import React from 'react';
import PropTypes from 'prop-types';

class DataQuery extends React.Component {
  constructor(props) {
    super(props);

    this.fetchData = this.fetchData.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.cancelPromise = this.cancelPromise.bind(this);

    this.state = {
      query: props.initQuery,
      data: {},
      loading: true,
      error: false,
      updateQuery: this.updateQuery,
      fetchData: this.fetchData
    };
  }

  componentDidMount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = true;
    this.fetchData(this.state.query);
  }

  componentWillUnmount() {
    // A special flag to indicate if a component was mount/unmount
    this._isMount = false;
    this.cancelPromise();
  }

  updateQuery(query) {
    this.setState({
      query
    });
  }

  cancelPromise() {
    if (this.axiosPromise && typeof this.axiosPromise.cancel === 'function') {
      this.axiosPromise.cancel();
    }
  }

  fetchData(query) {
    this.setState({
      loading: true,
      error: false
    });
    this.cancelPromise();

    this.axiosPromise = this.props.api({ ...this.state.query, ...query });

    this.axiosPromise.then(resp => {
      const data = resp.data;
      this.setState({
        data,
        loading: false,
        error: false
      });
    })
      .catch(() => {
        // Important for us due to the case of requests cancellation on unmount
        // Because in that case the request will be marked as cancelled=failed
        // and catch statement will try to update a state of unmounted component
        // which will throw an exception
        if (this._isMount) {
          this.setState({
            error: true
          });
        }
      });
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

export default DataQuery;
