import React, { PureComponent } from 'react';
import { Menu, Icon, Dropdown } from 'antd';

import { LOCALE_STORAGE_NAME } from '../../../api/locale';
import config from '../../../api/util/config';
import withContext from '../../hoc/withContext';

class SelectLang extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { languages: config.languages };
  }

  componentDidMount() {
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_NAME) || 'en';
    this.props.changeLocale(storedLocale);
  }

  getMenuItems = () => {
    const { languages } = this.state;
    return languages.map(lang => (
      <Menu.Item key={lang.key}>
          <span role="img" aria-label={lang.name}>
            {lang.code}
          </span>{' '}
        {lang.name}
      </Menu.Item>
    ));
  };

  render() {
    const { changeLocale } = this.props;
    const langMenu = (
      <Menu onClick={(e) => changeLocale(e.key)}>
        {this.getMenuItems()}
      </Menu>
    );

    return (
      <Dropdown overlay={langMenu} placement="bottomRight" trigger={['click']}>
        <Icon type="global" title="title"/>
      </Dropdown>
    );
  }
}

const mapContextToProps = ({ locale, changeLocale }) => ({ locale, changeLocale });

export default withContext(mapContextToProps)(SelectLang);