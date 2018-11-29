import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Menu, Icon, Dropdown } from 'antd';
import { changeLocale } from '../../../actions/locale'

class SelectLang extends PureComponent {
  componentDidMount(){
    const storedLocale = localStorage.getItem('locale') || 'en'
    this.props.changeLocale(storedLocale)
  }

  render() {
    const { changeLocale } = this.props;
    const langMenu = (
      <Menu onClick={(e) => {changeLocale(e.key)}} >
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
      <Dropdown overlay={langMenu} placement="bottomRight">
        <Icon
          type="global"
          title="title"
        />
      </Dropdown>
    );
  }
}

const mapStateToProps = state => ({
  locale: state.locale
})

const mapDispatchToProps = {
  changeLocale: changeLocale,
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectLang)