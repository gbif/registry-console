import React from 'react';

const Paper = ({children, padded}) => <div style={{background: 'white', padding: padded ? '16px': null}}>{children}</div>;

export default Paper;