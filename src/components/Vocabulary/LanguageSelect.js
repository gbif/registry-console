import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import withContext from "../hoc/withContext";
import { updateUser } from "../../api/user";
import _ from "lodash";
// Components
import { Select } from "antd";

const { Option } = Select;
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
      selected: [],
    };
  }
  componentDidMount = () => {
    if (_.get(this.props, "user.settings.vocabulary_languages")) {
      this.setState({
        selected: _.get(this.props, "user.settings.vocabulary_languages").split(
          "_"
        ),
      });
    }
  };

  componentDidUpdate = (prevProps) => {
    if (
      _.get(this.props, "user.settings.vocabulary_languages") &&
      _.get(this.props, "user.settings.vocabulary_languages") !==
        _.get(prevProps, "user.settings.vocabulary_languages")
    ) {
      this.setState({
        selected: _.get(this.props, "user.settings.vocabulary_languages").split(
          "_"
        ),
      });
    }
  };

  persistSelectedVocabularyLanguages = (selected) => {
    const { user, addError, loadActiveUser } = this.props;
    const newSettings = {
      ...user.settings,
      vocabulary_languages: selected.join("_"),
    };
    updateUser({ ...user, settings: newSettings }).then(loadActiveUser).catch(() =>
      addError("Selected languages could not be persisted")
    );
  };
  onChange = (selected) => {
    this.persistSelectedVocabularyLanguages(selected);
    this.setState({ selected }, this.props.onChange(selected));
  };

  render = () => {
    const { selected } = this.state;
    const { languages } = this.props;
    const displayLanguages =  [...new Set([...selected, ...languages])]
    return (
      <React.Fragment>
        <Select
          mode="multiple"
          style={{ minWidth: "204px", marginLeft: "10px" }}
          placeholder="Show languages"
          value={selected}
          onChange={this.onChange}
        >
          {displayLanguages.map((v) => (
            <Option key={v}>
              <FormattedMessage id={`vocabulary.language.${v}`} />
            </Option>
          ))}
        </Select>
      </React.Fragment>
    );
  };
}

LanguageSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired,
};

const mapContextToProps = ({ user, addError, loadActiveUser }) => ({
  user,
  addError,
  loadActiveUser,
});

export default withContext(mapContextToProps)(LanguageSelect);
