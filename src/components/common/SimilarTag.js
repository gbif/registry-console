import React, { useEffect, useState } from 'react';
import injectSheet from 'react-jss';
import { Tag } from 'antd';
import { Link } from 'react-router-dom'
import qs from 'qs';

const styles = {

};

/**
 * Component will show given content only partially
 * If the content is too high, component will render "Show More" button
 */
const SimilarTag = ({fn, query, color, threshold = 1, children, to}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const request = fn(query);
    request.then(({ data }) => {
      setCount(data.count);
    }).catch(() => {
      // ignore errors
    });
    // Specify how to clean up after this effect:
    return function cleanup() {
      request.cancel();
    };
  }, [fn, query]);

  return (<>
    {count > threshold && <Link to={`${to}?${qs.stringify(query)}`}><Tag color={color}>{children} {count}</Tag></Link>}
  </>
  );
}

export default injectSheet(styles)(SimilarTag);