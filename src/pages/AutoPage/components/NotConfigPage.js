
import React, { Component } from 'react';
import { Button } from 'antd';
export default class NotConfigPage extends Component {
    render() {
        return (<div style={{ position: 'relative', backgroundColor: 'rgba(240,242,245)', margin: '-20px' }}  >
            <img src={require('../../../assets/ufo.png')} style={{ width: '70%' }} />
            <div style={{ position: 'absolute', right: '100px', top: '200px', color: '#253D5D', fontFamily: 'sans-serif', fontSize: '38px', lineHeight: '20px' }} >
                <p style={{ fontSize: '78px', marginBottom: '80px', color: '#07ADB9' }} >404</p>
                <p style={{}} >哎呀</p>
                <p>配置文件被外星人偷走了</p>
                <Button onClick={() => this.props.getPageConfig()} >刷新</Button>
            </div>
        </div>)
    }
}