import React from "react";
import { Tag, Popover } from "antd";
import moment from "moment";

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
        <div>{key}</div>
        <div>{item.datasetTitle}</div>
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
    dataIndex: "",
    key: "x",
    render: () => <a href="javascript:;">Delete</a>
  }
];

export const data = [
  {
    key: 1,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park."
  },
  {
    key: 2,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park."
  },
  {
    key: 3,
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    description:
      "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park."
  }
];
