import React from "react";
import { Tag, Popover } from "antd";
// import moment from "moment";
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { HasRole, roles } from '../../auth';
import { ConfirmButton } from '../../common';
import { deleteCrawl } from '../../../api/monitoring';

const getDate = d => {
  let value = `${d.year} ${d.month} ${d.dayOfMonth} ${d.hour}:${d.minute}:${
    d.second
  }`; // 2019-06-10T21:43:38.794+0000
  return value;
};

const getPopoverContent = item => {
  return (
    <div style={{ maxWidth: 300 }}>
      <div>
        <strong>Started:</strong> {getDate(item.startDateTime)}
      </div>
      <div>
        <strong>Message:</strong> {item.error.message}
        {item.successful.message}
      </div>
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
    dataIndex: "pipelinesSteps",
    key: "pipelinesSteps",
    render: (list, item) => (
      <div>
        {list.map(x => (
          <Popover key={x.name} content={getPopoverContent(x)}>
            <Tag
              color={
                x.step.present
                  ? "blue"
                  : x.successful.availability
                  ? "green"
                  : "red"
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
