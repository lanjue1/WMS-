import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import { Button } from 'antd';
import { Element } from 'rc-scroll-anim';
import BannerImage from './BannerImage';
const assets = 'https://gw.alipayobjects.com/os/s/prod/antv/assets';

class Banner extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    navToShadow: PropTypes.func,
  };
  static defaultProps = {
    className: 'banner',
  };
  render() {
    const { className, isMobile, navToShadow } = this.props;
    return (
      <Element component="section" className={`${className}-wrapper page`} onChange={navToShadow}>
        <div className={className}>
          <div className={`${className}-img-wrapper`}>
            {isMobile ? (
              <img width="100%" src={`${assets}/image/home/intro-landscape-3a409.svg`} alt="" />
            ) : (
                <BannerImage />
              )}
          </div>
          <QueueAnim
            type={isMobile ? 'bottom' : 'right'}
            className={`${className}-text-wrapper`}
            delay={300}
          >
            <h1 key="h1">让物流聪明起来</h1>
            <p className="main-info" key="p">
              56.HICHAIN.COM是一个以数据驱动、物联世界、高效协同的物流云平台，致力为客户提供智能运输、仓储管理、关务服务、系统集成等一体化物流解决方案。
            </p> 
            {/* <a target="_blank" href="https://antv.alipay.com/zh-cn/g2/3.x/index.html" key="a">
              <Button type="primary">
                开始使用
              </Button>
            </a>*/}
            {/* <img src={require('@/assets/hichainLogo.png')} style={{ width: '860px', height: '300px', position: 'fixed', bottom: '8px', right: '-12px' }} /> */}
          </QueueAnim>
        </div>
      </Element>
    );
  }
}

export default Banner;
