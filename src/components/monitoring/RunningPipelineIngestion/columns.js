import React from "react";
import { Tag, Popover } from "antd";
import moment from "moment";
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { HasRole, roles } from '../../auth';
import { ConfirmButton } from '../../common';
import { deleteCrawl } from '../../../api/monitoring';

const getDate = dateString => moment.utc(dateString).format('ddd DD MMM YYYY HH:mm:ss');

const extractJSON = str => {
  if (!str) return str;
  //a simple attempt to extract JSON. not important so if it fails just show raw.
  const start = str.indexOf('{');
  const jsonCandidate = str.substr(start);
  try {
    const jsonMessage = JSON.parse(jsonCandidate);
    return <div>
      {str.substr(0, start)}
      <pre>{JSON.stringify(jsonMessage, null, 2)}</pre>
      </div>
  } catch(err) {
    return str;
  }
}

const getPopoverContent = item => {
  return (
    <div style={{ maxWidth: 400 }}>
      <div>
        <strong>Started:</strong> {getDate(item.started)}
      </div>
      {item.finished && <div>
        <strong>Started:</strong> {getDate(item.finished)}
      </div>}
      <div>
        <strong>Runner:</strong> {item.runner}
      </div>
      {item.message && <div style={{wordBreak: 'break-all'}}>
        <strong>Message:</strong> {extractJSON(item.message)}
      </div>}
    </div>
  );
};

export const columns = [
  {
    title: "Dataset",
    dataIndex: "datasetKey",
    key: "dataset",
    render: (key, item) => (
      <div>
        <Link to={`/dataset/${key}`}>{item.datasetTitle || key}</Link>
      </div>
    )
  },
  { title: "Attempt", dataIndex: "attempt", key: "attempt" },
  {
    title: "Steps",
    dataIndex: "steps",
    key: "steps",
    render: (list, item) => (
      <div>
        {list.map(x => (
          <Popover key={x.name} content={getPopoverContent(x)}>
            <Tag
              color={
                x.state === 'COMPLETED'
                  ? "green"
                  : x.state === 'FAILED'
                  ? "red"
                  : "blue"
              }
            >
              {x.name}
            </Tag>
          </Popover>
        ))}
      </div>
    )
  },
  {
    title: "Action",
    dataIndex: "crawlId",
    key: "x",
    render: (crawlId, item) => <HasRole roles={roles.REGISTRY_ADMIN}>
      <ConfirmButton
        title={<FormattedMessage id="delete.confirmation.generic" defaultMessage="Delete this entry?"/>}
        btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
        onConfirm={() => deleteCrawl(crawlId)}
        type={'link'}
      />
    </HasRole>
  }
];
