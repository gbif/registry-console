import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { FormattedMessage } from 'react-intl';

const styles = {
  container: {
    position: 'relative',
    maxHeight: '150px',
    overflow: 'hidden'
  },
  showMore: {
    maxHeight: 'none'
  },
  content: {
    whiteSpace: 'pre-line'
  },
  toggle: {
    position: 'absolute',
    right: 0,
    bottom: '3px',
    background: '#fff',
    paddingLeft: '15px',
    color: '#1890ff',
    '&:before': {
      content: "'...'",
      paddingRight: '5px'
    },
    '&:hover': {
      cursor: 'pointer',
      color: '#40a9ff'
    }
  }
};

/**
 * Component will show given content only partially
 * If the content is too high, component will render "Show More" button
 */
class ShowMoreContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMore: false,
      showToggle: true
    };
    this.content = React.createRef();
  }

  componentDidMount() {
    if (this.content.current.clientHeight <= 150) {
      this.setState({ showToggle: false })
    }
  }

  toggle = () => {
    this.setState(state => {
      return {
        showMore: !state.showMore
      }
    });
  };

  getToggleText = () => {
    const { showMore } = this.state;

    if (showMore) {
      return <FormattedMessage id="button.showLess" defaultMessage="Show less"/>;
    }

    return <FormattedMessage id="button.showMore" defaultMessage="Show more"/>;
  };

  render() {
    const { showMore, showToggle } = this.state;
    const { content, classes } = this.props;
    const containerClasses = [classes.container];
    if (showMore) {
      containerClasses.push(classes.showMore);
    }

    return (
      <div className={containerClasses.join(' ')}>
        <div className={classes.content} ref={this.content} dangerouslySetInnerHTML={{__html: content}}/>
        {showToggle && (
          <div className={classes.toggle} onClick={this.toggle}>
            {this.getToggleText()}
          </div>
        )}
      </div>
    );
  }
}

ShowMoreContent.propTypes = {
  content: PropTypes.string.isRequired
};

export default injectSheet(styles)(ShowMoreContent);