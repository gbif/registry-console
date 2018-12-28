import React, { PureComponent } from 'react';
import { Menu, Icon, Dropdown } from 'antd';

import { LOCALE_STORAGE_NAME } from '../../../api/locale';
import withContext from '../../hoc/withContext';

class SelectLang extends PureComponent {
  componentDidMount() {
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_NAME) || 'en';
    this.props.changeLocale(storedLocale);
  }

  render() {
    const { changeLocale } = this.props;
    const langMenu = (
      <Menu onClick={(e) => {
        changeLocale(e.key);
      }}>
        <Menu.Item key="en">
          <span role="img" aria-label="English">
            🇬🇧
          </span>{' '}
          English
        </Menu.Item>
        <Menu.Item key="kk">
          <span role="img" aria-label="Kazakh">
            🇰🇿
          </span>{' '}
          Қазақша
        </Menu.Item>
        <Menu.Item key="da">
          <span role="img" aria-label="Dansk">
            🇩🇰
          </span>{' '}
          Dansk
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={langMenu} placement="bottomRight" trigger={['hover', 'click']}>
        <Icon
          type="global"
          title="title"
        />
      </Dropdown>
    );
  }
}

const mapContextToProps = ({ locale, changeLocale }) => ({ locale, changeLocale });

export default withContext(mapContextToProps)(SelectLang);