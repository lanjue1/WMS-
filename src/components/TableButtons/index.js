import React, { PureComponent, Fragment } from 'react';
import { Button, Alert } from 'antd';
import AdButton from '@/components/AdButton';
import styles from './index.less';
import { transferLanguage } from '@/utils/utils';
import { connect } from 'dva';

@connect(({ i18n }) => ({
    language: i18n.language
}))
export default class TableButtons extends PureComponent {
    // state = {
    //   multi: false,
    // };
    // componentWillReceiveProps(nextProps) {
    //   const { selectedLength } = this.props;
    //   if (nextProps.selectedLength !== selectedLength) {
    //     if (nextProps.selectedLength - selectedLength > 1) {
    //       this.setState({
    //         multi: true,
    //       });
    //     } else {
    //       this.setState({
    //         multi: false,
    //       });
    //     }
    //   }
    // }
    render() {
        /*
        selectedLength:显示选择的长度
        selectAll,cancelAll：全选，取消全选事件，
        isSelectAll：是否是全选的控制条件，
        pagination：页面的page信息
        */
        const { handleAdd, buttons, buttonsSecond, rightButtons, language,
            rightButtonsFist, addName, code, 
            pagination, selectedLength, selectAll,cancelAll,
            selectAllType, total ,
            isSelectAll
        } = this.props;
        // const { multi } = this.state;
        const _selectedLength=isSelectAll? pagination.total:selectedLength
        return (
            <div className={styles.tableListOperator}  >
                <div style={{ display: 'flex' }} >
                    {_selectedLength > 0 && (
                        <Alert
                            message={
                                <Fragment>
                 <a style={{ fontWeight: 600 }}>{selectAllType ? total : _selectedLength}</a> 
                                    {transferLanguage('Common.field.haveSelected',language)}
                  
                  <span style={{ marginLeft: 8 }}>
                                        {transferLanguage('Common.field.total',language)+':'}
                    <span style={{ fontWeight: 600 }}>{pagination && pagination.total}</span>
                                    </span>
                                    
                                    {!isSelectAll? <AdButton
                                        mode="a"
                                        code={code}
                                        onClick={selectAll}
                                        style={{ marginLeft: 8 }}
                                        text={transferLanguage('Common.field.selectAll',language)}
                                    />:
                                    <AdButton
                                        mode="a"
                                        code={code}
                                        onClick={cancelAll}
                                        style={{ marginLeft: 8 }}
                                        text={transferLanguage('Common.field.cancel',language)}
                                    />}
                                    
                                </Fragment>
                            }
                            type="info"
                            showIcon
                        />
                    )}
                    {buttons}
                </div>
                <div>
                    {rightButtonsFist && rightButtonsFist}
                    {rightButtons && rightButtons}

                    {handleAdd &&
                        <AdButton style={{ marginLeft: 8 }} type="primary"
                            onClick={handleAdd}
                            text={addName ? addName : transferLanguage('Common.field.add', language)} code={code} />}
                </div>

            </div>
        );
    }
}
