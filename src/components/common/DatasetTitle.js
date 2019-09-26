import React from "react";
import fieldFormatter from "./fieldFormatter";
import { getDataset } from '../../api/dataset'
import PropTypes from "prop-types";

const DatasetTitle = fieldFormatter(id => getDataset(id));

DatasetTitle.propTypes = {
  query: PropTypes.object
};

export default DatasetTitle;