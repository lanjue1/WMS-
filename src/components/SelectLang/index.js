import React, { PureComponent } from 'react';
import { formatMessage, setLocale, getLocale } from 'umi-plugin-react/locale';
import { Menu, Icon } from 'antd';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { connect } from 'dva';
import {
  TranslationOutlined , BankOutlined  
} from '@ant-design/icons';
@connect(({ login, i18n }) => ({
  login,
  user: login.user,
}))
export default class SelectLang extends PureComponent {
  changeLang = ({ key }) => {
    // setLocale(key);
    this.props.dispatch({
      type: 'i18n/fetch',
      payload: { type: key },
      callback: (res) => {
        localStorage.setItem('language_type', key)
        localStorage.setItem('language', JSON.stringify(res));
        window.location.reload();
      }
    });
  };

  render() {
    const { className } = this.props;
    const selectedLang = localStorage.getItem('language_type') ? localStorage.getItem('language_type') : 'en-US';
    const locales = ['zh-CN', 'en-US',];
    let indexOf=selectedLang.lastIndexOf('-')
		const lang=selectedLang.slice( 0,indexOf).toLocaleUpperCase()
    const languageLabels = {
      'zh-CN': '简体中文',
      'en-US': 'English',
      'pt-BR': 'Português',
    };
    const languageIcons = {
      'zh-CN': '🇨🇳',
      // 'zh-TW': '🇭🇰',
      'en-US': 'e🇳',
      // 'pt-BR': '🇧🇷',
    };
    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={this.changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <HeaderDropdown overlay={langMenu} placement="bottomRight">
        <span className={classNames(styles.dropDown, className)} style={{marginRight:10}}>
          {/* <Icon type="global" style={{marginLeft:'8px'}} title={'Languages'} /> */}
          <TranslationOutlined style={{marginLeft:'8px',marginRight:'3px'}} title={'Languages'} />
          {lang}
        </span>
      </HeaderDropdown>
    );
  }
}
