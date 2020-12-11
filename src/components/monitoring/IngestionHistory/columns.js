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
}

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
        <strong>Metrics:</strong> <pre>{JSON.stringify(item.metrics, null, 2)}</pre>
      </div>}
      {item.message && <div style={{ wordBreak: 'break-all' }}>
        <strong>Message:</strong> {extractJSON(item.message)}
      </div>}
    </div>
  );
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
  // {
  //   title: "Crawl info", width: 300, dataIndex: "crawlInfo", key: "crawlInfo", render: (crawlInfo, item) => {
  //     return {
  //       children: <div>
  //         {crawlInfo.startedCrawling && <div>
  //           <strong>Started:</strong> {getDate(crawlInfo.startedCrawling)}
  //         </div>}
  //         {crawlInfo.finishedCrawling && <div>
  //           <strong>Finished:</strong> {getDate(crawlInfo.finishedCrawling)}
  //         </div>}
  //         {['finishReason', 'processStateOccurrence', 'processStateChecklist', 'pagesCrawled', 'pagesFragmentedSuccessful', 'pagesFragmentedError', 'fragmentsEmitted', 'fragmentsReceived', 'fragmentsProcessed'].map(field => {
  //           if (!crawlInfo[field]) return undefined;
  //           return <div key={field}>
  //             <strong>{field}:</strong> {crawlInfo[field]}
  //           </div>
  //         })}
  //       </div>,
  //       props: { rowSpan: !item.pipelineExecutions ? 1 : item.firstInGroup ? item.pipelineExecutions.length : 0 }
  //     };
  //   }
  // },
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
              <Tag
                color={
                  x.state === 'RUNNING'
                    ? "green"
                    : x.state === 'FAILED'
                      ? "red"
                      : "blue"
                }
              >
                <strong>{x.type}</strong> : {x.numberRecords ? x.numberRecords.toLocaleString() : 'No count provided'}
              </Tag>
            </Popover>
          ))}
        </div>
      )
    }
  }
];
