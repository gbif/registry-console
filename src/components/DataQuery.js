import React from 'react';
import BreadCrumbs from './widgets/BreadCrumbs';
import withContext from './hoc/withContext';

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
      updateQuery: this.updateQuery,
      fetchData: this.fetchData
    };
  }

  componentWillMount() {
    this.fetchData(this.state.query);
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
    this.setState({ loading: true });
    this.cancelPromise();

    this.axiosPromise = this.props.api({ ...this.state.query, ...query });

    this.axiosPromise
      .then(resp => {
        const data = resp.data;
        this.setState({
          data,
          loading: false
        });
      })
      .catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
  }

  render() {
    return (
      <React.Fragment>
        <BreadCrumbs listType={this.props.listType}/>

        {this.props.render(this.state)}
      </React.Fragment>
    );
  }
}

const mapContextToProps = ({ addError }) => ({ addError });

export default withContext(mapContextToProps)(DataQuery);
