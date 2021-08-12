import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import axios from 'axios';
import styles from '../index.less';

// const reportName = '国内车证件到期提醒';

// const src = `https://bi.hichain.com/webroot/decision/view/report?viewlet=production/TMS/3.车队系统/车队证件到期提醒/${reportName}.cpt`;
const topHeight = 69 + 24;

@connect(({ }) => ({}))
export default class CoReport extends Component {
    state = {
        url: '',
    };
    pageCode = this.props?.match?.params?.id
    componentDidMount() {
        const { dispatch, match: { params } } = this.props;
        dispatch({
            type: 'autoPage/getPageConfig',
            payload: {
                id: this.pageCode
            },
            callback: (data) => {
                let url = data?.data?.windowLayout?.requestUrl
                let params = data?.data?.windowLayout?.params
                dispatch({
                    type:'component/getBiReport',
                    payload:{
                        requestUrl:url,
                        params
                    },
                    callback:url=>{
                        this.setState({ url });
                    }
                })
            }
        })
    }

    print = () => {
        document.getElementById('test').focus();
        document.getElementById('test').contentWindow.print();
        // var tarValue = '?reportlet=/demo/basic/档案式报表.cpt';
        // //设置url地址，加上Date().getTime()防止缓存
        // var url =
        //   'http://bi.hichain.com/webroot/wy.html?_=' + new Date().getTime() + '&tarValue=' + tarValue;
        // console.log('===========', url);
        // //添加一个新的iframe，并为该iframe添加一个src，用来打开test.html，让其执行跨域打印的js代码
        // var iframe = $(
        //   "<iframe id='reportFrame' name='reportFrame' width='100%' height='100%' scrolling='yes' frameborder='0'>"
        // ); // 对话框内 iframe 参数的命名，默认宽高占比是 100%，可向下滚动
        // iframe.attr('src', url); // 给 iframe 添加 src 属性
        // var o = {
        //   width: 700, //对话框宽度
        //   height: 500, //对话框高度
        // };
        // FR.showDialog('添加', o.width, o.height, iframe, o); //弹出对话框
    };

    render() {
        return (
            <div className={styles.wrap}>
                {/* <Button onClick={this.print}>打印</Button> */}
                <iframe
                    id="test"
                    width="100%"
                    frameBorder="no"
                    scrolling="no"
                    crossorigin="anonymous"
                    rel="noreferrer"
                    height={document.body.clientHeight - topHeight}
                    src={this.state.url}
                />
            </div>
        );
    }
}
