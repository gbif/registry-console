import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';


// Components
import {Select} from "antd";

const {Option} = Select;
/**
 * Vocabulary Actions component
 * Displays buttons depends on user's roles and scope, and item's state
 * @param selected - array of selected languages
 * @param onChange - callback to invoke any parent process
 * @returns {*}
 * @constructor
 */
class LanguageSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
          selected: []
        };
      }

onChange = (selected) =>{
this.setState({selected}, this.props.onChange(selected))
}

render = () => {
  const {selected} = this.state;
  const {languages} = this.props;
  return (
    <React.Fragment>
      <Select
    mode="multiple"
    style={{ minWidth: '204px', marginLeft: '10px' }}
    placeholder="Show languages"
    value={selected}
    onChange={this.onChange}
  >
    {languages.map(v => <Option key={v}><FormattedMessage id={`vocabulary.language.${v}`}/></Option>)}
  </Select>
    </React.Fragment>
  );
};
}

LanguageSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired
};


export default LanguageSelect;