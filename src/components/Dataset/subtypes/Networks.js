import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { getNetworks } from '../../../api/dataset';
// Configuration
import { standardColumns } from '../../search/columns';
// Components
import DataTable from '../../common/DataTable';
import DataQuery from '../../DataQuery';

const columns = [
  {
    title: <FormattedMessage id="title" defaultMessage="Title"/>,
    dataIndex: 'title',
    width: '50%',
    render: (text, record) => <Link to={`/network/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const Networks = ({ datasetKey, initQuery = {} }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="networks" defaultMessage="Networks"/>
      </h2>
      <DataQuery
        api={() => getNetworks(datasetKey)}
        initQuery={initQuery}
        render={props => <DataTable {...props} noHeader={true} columns={columns} />}
      />
    </React.Fragment>
  );
};

Networks.propTypes = {
  datasetKey: PropTypes.string.isRequired
};