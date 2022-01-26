import React, { Component } from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import { CheckCircleFilled, CloseOutlined } from '@ant-design/icons';

const styles = {
  container: {
    background: '#fff',
    textAlign: 'center',
    display: 'inline-block',
    width: '100%',
    marginBottom: '16px',
    paddingTop: '12px',
    position: 'relative'
  },
  closeElement: {
    position: 'absolute',
    top: '8px',
    right: '16px',
    overflow: 'hidden',
    fontSize: '12px',
    lineHeight: '22px',
    cursor: 'pointer',
    transition: 'color .3s ease',
    color: 'rgba(0,0,0,0.45)',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    '&:hover': {
      color: 'rgba(0,0,0,0.75)'
    }
  },
  iconContainer: {
    marginBottom: '24px',
    fontSize: '72px',
    lineHeight: '72px'
  },
  icon: {
    color: '#52c41a'
  },
  title: {
    margin: '0 auto 16px',
    color: 'rgba(0,0,0,.85)',
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '32px'
  },
  message: {
    margin: '0 auto 24px',
    width: '95%',
    maxWidth: '800px',
    color: 'rgba(0,0,0,.45)',
    fontSize: '14px',
    lineHeight: '22px'
  }
};

/**
 * Component can display successful feedback with icon, title and optional message
 */
class CreationFeedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      closed: false
    };
  }

  close = () => {
    this.setState({ closed: true });
  };

  render() {
    const { closed } = this.state;
    const { title, message, classes } = this.props;

    if (closed) return null;

    return (
      <div className={classes.container}>
        <button className={classes.closeElement} onClick={this.close}>
          <CloseOutlined />
        </button>
        <div className={classes.iconContainer}>
          <CheckCircleFilled className={classes.icon} />
        </div>
        <h6 className={classes.title}>{title}</h6>
        {message && <div className={classes.message}>{message}</div>}
      </div>
    );
  }
}

CreationFeedback.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  message: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default injectSheet(styles)(CreationFeedback);