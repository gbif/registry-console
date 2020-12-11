import React from "react";
import { Tag, Popover, Button } from "antd";
import moment from "moment";
import { Link } from 'react-router-dom';
import config from '../../../api/util/config';
import { HasRole, roles } from '../../auth';
import { ConfirmButton } from '../../common';
import { deleteCrawl } from '../../../api/monitoring';
import { FormattedMessage } from 'react-intl';

const getDate = dateString => moment.utc(dateString).format('ddd DD MMM YYYY HH:mm:ss');

const extractJSON = str => {
  if (!str) return str;
  //a simple attempt to extract JSON. not important so if it fails just show raw.
  const start = str.indexOf('{');
  const jsonCandidate = str.substr(start);
  if (jsonCandidate.length < 2) return str;
  try {
    const jsonMessage = JSON.parse(jsonCandidate);
    return <div>
      {str.substr(0, start)}
      <pre>{JSON.stringify(jsonMessage, null, 2)}</pre>
    </div>
  } catch (err) {
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
        <strong>Finished:</strong> {getDate(item.finished)}
      </div>}
      {item.pipelinesVersion && <div>
        <strong>Pipelines version:</strong> {item.pipelinesVersion}
      </div>}
      <div>
        <strong>Runner:</strong> {item.runner}
      </div>
      <div>
        <strong>State:</strong> {item.state}
      </div>
      {item.message && <div style={{ wordBreak: 'break-all' }}>
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
    render: (key, item) => {
      return {
        children: <div>
          <Link to={`/dataset/${key}`}>{item.datasetTitle || item.datasetKey}</Link>
        </div>
      };
    }
  },
  // { title: "Attempt", dataIndex: "attempt", key: "attempt" }, // removed as per suggestion in https://github.com/gbif/registry-console/issues/337
  { title: "Execution key", dataIndex: "executions", key: "executions", render: (executions, item) => (executions[0].key) },
  {
    title: "Steps",
    dataIndex: "executions",
    key: "steps",
    render: list => (
      <div>
        {list[0].steps.map(x => (
          <Popover key={x.type} content={getPopoverContent(x)}>
            <Tag
              color={
                x.state === 'RUNNING'
                  ? "green"
                  : x.state === 'FAILED'
                    ? "red"
                    : "blue"
              }
            >
              {x.type}
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
    render: (crawlId, item) => <div style={{ whiteSpace: 'nowrap' }}>
      <Button style={{ marginRight: 5 }} type="link" href={config.logLinks.datasetAttempt.replace(/\{\{UUID\}\}/g, item.datasetKey).replace(/\{\{ATTEMPT\}\}/g, item.attempt)} target="_blank" rel="noopener noreferrer">
        Log
      </Button>
      <Button style={{ marginRight: 5 }} type="link" href={`${config.dataApi_v1}/pipelines/process/running/${item.datasetKey}/${item.attempt}`} target="_blank" rel="noopener noreferrer">
        API
      </Button>
      <HasRole roles={roles.REGISTRY_ADMIN}>
        <ConfirmButton
          title={<FormattedMessage id="delete.confirmation.generic" defaultMessage="Delete this entry?" />}
          btnText={<FormattedMessage id="delete" defaultMessage="Delete" />}
          onConfirm={() => deleteCrawl(item.datasetKey, item.attempt)}
          type={'danger'}
        />
      </HasRole>

    </div>
  }
];
