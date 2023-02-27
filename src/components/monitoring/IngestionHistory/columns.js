import React from "react";
import { Tag, Popover, Button } from "antd";
import moment from "moment";
import { Link } from 'react-router-dom';
import config from '../../../api/util/config';

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
};

const formatMetrics = metrics => {
  let m = [];
  metrics.forEach(e => {
    let name = e.name.replace('Attempted', '').replace(/([A-Z])/g, ' $1').toLowerCase().trim()
    m.push('- ' + name + ': ' + e.value);
  });
  return m.join('\n');
};

const getPopoverContent = item => {
  return (
    <div style={{ maxWidth: 600 }}>
      {item.started && <div>
        <strong>Started:</strong> {getDate(item.started)}
      </div>}
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
      {item.metrics && <div style={{ wordBreak: 'break-all' }}>
        <strong>Metrics:</strong> <pre>{formatMetrics(item.metrics)}</pre>
      </div>}
      {item.message && <div style={{ wordBreak: 'break-all' }}>
        <strong>Message:</strong> {extractJSON(item.message)}
      </div>}
    </div>
  );
};

const getStateStatusColor = step => {
  if(step.state === 'RUNNING'){
    return "green";
  }
  if(step.state === 'FAILED'){
    return "red";
  }
  if(step.state === 'ABORTED'){
    return "#494747";
  }
  if(step.state === 'SUBMITTED'){
    return "#CFCFCE";
  }
  if(step.state === 'QUEUED'){
    return "#F8B608";
  }
  return "blue";
};

const getStateStatusText = step => {
  if(step.numberRecords >= 0){
    return step.numberRecords.toLocaleString();
  }
  if(step.numberRecords === -1){
    return 'More than one metric';
  }
  return 'No count provided';
};

export const columns = [
  {
    title: "Dataset",
    width: 250,
    dataIndex: "datasetKey",
    key: "dataset",
    render: (key, item) => {
      return {
        children: <div>
          <Link to={`/dataset/${key}`}>{item.datasetTitle}</Link>
        </div>,
        props: { rowSpan: !item.executions ? 1 : item.firstInGroup ? item.executions.length : 0 }
      }
    }
  },
  {
    title: "Attempt", width: 100, dataIndex: "attempt", key: "attempt", render: (key, item) => {
      return {
        children: <div>
          <div style={{ margin: 5 }}>{key}</div>
          <div>
            <Button style={{ margin: 5 }} type="link" href={config.logLinks.datasetAttempt.replace(/\{\{UUID\}\}/g, item.datasetKey).replace(/\{\{ATTEMPT\}\}/g, item.attempt)} target="_blank" rel="noopener noreferrer">
              Log
            </Button>
            <Button style={{ margin: 5 }} type="link" href={`${config.dataApi_v1}/pipelines/history/${item.datasetKey}/${item.attempt}`} target="_blank" rel="noopener noreferrer">
              API
            </Button>
          </div>
        </div>,
        props: { rowSpan: !item.executions ? 1 : item.firstInGroup ? item.executions.length : 0 }
      };
    }
  },
  {
    title: "Executions",
    dataIndex: "_execution",
    key: "_execution",
    render: (execution) => {
      if (execution.type === 'PLACEHOLDER') return;
      return (
        <div>
          <div>
            <strong>Key:</strong> {execution.key}
          </div>
          {execution.created && <div>
            <strong>Created:</strong> {getDate(execution.created)}
          </div>}
          {execution.rerunReason && <div>
            <strong>Rerun reason:</strong> {execution.rerunReason}
          </div>}
          {execution.stepsToRun && 
          <div>
            <strong>Steps to run:</strong> {execution.stepsToRun.join(', ')}
          </div>}
        </div>
      )
    }
  },
  {
    title: "Steps",
    dataIndex: "_execution",
    key: "steps",
    render: (execution, item) => {
      if (execution.type === 'PLACEHOLDER') return;
      return (
        <div>
          {execution.steps.map(x => (
            <Popover key={x.key} content={getPopoverContent(x)}>
              <Tag color={getStateStatusColor(x)}>
                <strong>{x.type}</strong> : {getStateStatusText(x)}
              </Tag>
            </Popover>
          ))}
        </div>
      )
    }
  }
];
