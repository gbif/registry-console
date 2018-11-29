import React from 'react'
import { connect } from 'react-redux'
import { clearErrors } from '../actions/errors'
import { message } from 'antd';

class Errors extends React.Component {
  componentDidUpdate() {
    const { errors } = this.props
    if (errors.length > 0) {
      const error = errors[0];
      message.error(error.statusText);
      clearErrors();
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  errors: state.errors
})

const mapDispatchToProps = {
  clearErrors: clearErrors,
}

export default connect(mapStateToProps, mapDispatchToProps)(Errors)