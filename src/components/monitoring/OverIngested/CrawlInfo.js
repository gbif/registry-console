import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import _maxBy from 'lodash/maxBy';

const styles = {
  chart: {
    height: '60px'
  },
  column: {
    background: '#8fbc8f',
    display: 'inline-block',
    border: '1px solid #fff',
    width: '20px',
    minHeight: '5px',
    boxSizing: 'border-box'
  }
};

/**
 * Component displays simple histogram based on dataset's crawl history
 * @param crawlInfo
 * @param classes
 * @returns {*}
 * @constructor
 */
const CrawlInfo = ({ crawlInfo, classes }) => {
  const getHeight = (list, crawl) => 100 * crawl.count / _maxBy(list, 'count').count;
  const getMaxWidth = list => 100 / list.length;

  return (
    <div className={classes.chart}>
      {crawlInfo.map(crawl => (
        <div key={crawl.crawlId} className={classes.column} style={{
          height: `${getHeight(crawlInfo, crawl)}%`,
          maxWidth: `${getMaxWidth(crawlInfo)}%`
        }}/>
      ))}
    </div>
  );
};

CrawlInfo.propTypes = {
  crawlInfo: PropTypes.array.isRequired
};

export default injectSheet(styles)(CrawlInfo);