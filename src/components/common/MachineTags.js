import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

// Components
import PresentationGroupHeader from './PresentationGroupHeader';
import FormattedRelativeDate from './FormattedRelativeDate';

const styles = {
  row: {
    borderBottom: '1px solid #eee',
    '&:last-of-type': {
      border: 'none'
    }
  },
  title: {
    fontSize: '16px',
    padding: '0 5px'
  },
  type: {
    fontSize: '14px',
    color: 'grey',
    fontWeight: 'normal',
    padding: '0 5px'
  },
  meta: {
    fontSize: '12px',
    padding: '5px'
  },
  empty: {
    padding: '5px',
    textAlign: 'center'
  }
};

const MachineTags = ({ tags, classes }) => {
  return (
    <dl>
      <PresentationGroupHeader title={<FormattedMessage id="machineTags" defaultMessage="Machine tags"/>}/>
      {tags.length > 0 ? (
        tags.map(tag => (
          <div key={tag.key} className={classes.row}>
            <div className={classes.title}>{tag.name} = {tag.value}</div>
            <div className={classes.type}>{tag.namespace}</div>
            <div className={classes.meta}>
              <FormattedMessage
                id="createdByRow"
                defaultMessage={`Created {date} by {author}`}
                values={{ date: <FormattedRelativeDate value={tag.created}/>, author: tag.createdBy }}
              />
            </div>
          </div>
        ))
        ) : (
        <div className={classes.empty}>
          <FormattedMessage id="noMachineTags" defaultMessage="No machine tags"/>
        </div>
      )}
    </dl>
  );
};

MachineTags.propTypes = {
  tags: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(MachineTags);