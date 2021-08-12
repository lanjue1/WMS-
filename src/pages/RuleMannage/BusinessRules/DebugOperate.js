import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Divider, Icon } from 'antd';
import { withRouter } from 'umi';
import moment, { isDate } from 'moment';
import prompt from '@/components/Prompt';
import StandardTable from '@/components/StandardTable';
import AntdInput from '@/components/AntdInput';
import AdSelect from '@/components/AdSelect';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import AntdDatePicker from '@/components/AntdDatePicker';
import SearchSelect from '@/components/SearchSelect';
import { allDictList } from '@/utils/constans';
import {
    codes,
    allDispatchType,
    saveAllValue
} from './utils';
import styles from './index.less';

@connect(({ businessRules, component, loading }) => ({
    dictObject: component.dictObject,
    debuglist: businessRules.debuglist,
    loading: loading.effects[allDispatchType.debuglist],
}))
@Form.create()
@withRouter
export default class DebugOperate extends Component {
    constructor(props) {
        super(props);
        const {
            form: { getFieldDecorator },
        } = props;
        this.state = {
            detailId: '',
            selectedRows: [],
            debuglist: []
        };
        this.commonParams = {
            getFieldDecorator,
        };
    }

    throttleArg = true;

    columns = [
        {
            title: 'Key',
            dataIndex: 'Key',
            width: 250,
            render: (text, record, index) => {
                const { onlyRead } = this.props;
                if (!onlyRead) {
                    return (
                        <AntdFormItem
                            label=" "
                            code={`Key-${record.id}`}
                            {...this.commonParams}
                            initialValue={text}
                        >
                            <AntdInput placeholder="" onChange={value => this.handleFieldChange(value, 'Key', record.id, index)} />
                        </AntdFormItem>
                    );
                }
                return <span>{text}</span>;
            },
        },
        {
            title: 'Value',
            dataIndex: 'Value',
            width: 250,
            render: (text, record, index) => {
                const { onlyRead } = this.props;
                if (!onlyRead) {
                    return (
                        <AntdFormItem
                            label=" "
                            code={`Value-${record.id}`}
                            {...this.commonParams}
                            initialValue={text}
                        >
                            <AntdInput placeholder=""
                                onChange={value => this.handleFieldChange(value, 'Value', record.id, index)}
                            />
                        </AntdFormItem>
                    );
                }
                return <span>{text}</span>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (text, record, index) => (
                index !== this.state.debuglist.length - 1 &&
                <span>
                    <a onClick={() => this.removeInfo(record.id)} style={{ fontSize: 18 }}>
                        <Icon type="delete" title="删除" />
                    </a>
                </span>
            ),
        },
    ];

    componentWillMount() { }

    componentDidMount() {
        const { detailId } = this.props;
        this.addInfo()
        if (!detailId) return;
        this.handleStateChange([{ detailId }]);
    }

    //封装添加的json数据
    getAddDataObj = () => {
        return {
            id: `isNew${Math.ceil(Math.random() * 10000) + 10000}`,
            Key: '',
            Value: '',
        };
    };

    //添加
    addInfo = () => {
        const { detailId } = this.state;
        const newData = [...this.state.debuglist, this.getAddDataObj()]
        this.saveAllValue({ debuglist: newData })
        setTimeout(() => {
            this.setState({
                debuglist: newData
            }, () => {
                this.throttleArg = true;
            })
        }, 0)
    };
    //移除
    removeInfo = id => {
        const { detailId, debuglist } = this.state;
        const newData = debuglist.filter((item) => item.id !== id);
        this.handleStateChange([{ debuglist: newData }]);
        this.saveAllValue({ debuglist: newData })
    };

    getInfoData = () => {
        const { detailId, debuglist } = this.state;
        let newData = [];
        if (debuglist && debuglist.length > 0) {
            newData = debuglist.map(item => ({ ...item }));
        }
        return newData;
    };

    getRowByKey(id, newData) {
        const data = this.getInfoData();
        return (newData || data).filter(item => item.id === id)[0];
    }

    handleFieldChange(value, fieldName, id, index) {
        const { detailId, debuglist: stateDebugList } = this.state;
        const { dispatch, form, debuglist } = this.props;
        const newData = this.getInfoData();
        const target = this.getRowByKey(id, newData);

        if (target) {
            target[fieldName] = value;
            // for (let i = 0; i < debuglist.length; i++) {
            //     if (debuglist[i].id === id) {
            //         debuglist[i][fieldName] = value
            //     }
            // }

        }
        if (index == stateDebugList.length - 1 && this.throttleArg) {
            this.throttleArg = false; //节流控制，防止点击过快，添加多条数据
            this.addInfo()
        }
        /*
            要做的效果，监测到最后一个表单有值，就添加一行空数据
            （判断逻辑：就判断它是不是最后一行
            改变当前行数据，当前行没有下一行数据，就添加一条数据）
            添加之后，手动删除的数据，空行不做处理，让用户自己删除
        */

        this.handleStateChange([{ debuglist: newData }])
        this.saveAllValue({ debuglist: newData })
    }

    saveAllValue = payload => {
        const { dispatch } = this.props;
        dispatch({
            type: allDispatchType.value,
            payload: payload || {},
        });
    };

    handleStateChange = (options = []) => {
        options.map(item => {
            this.setState(item);
        });
    };

    render() {
        const {
            loading,
            detailId,
            disabled,

        } = this.props;
        const { selectedRows, debuglist } = this.state;
        const data = { list: debuglist };
        return (
            <div className="customPartsFormTable">
                <AntdForm>
                    <StandardTable
                        loading={loading}
                        data={data}
                        columns={this.columns}
                        // selectedRows={selectedRows}
                        disabledRowSelected={true}
                        pagination={false}
                        scrollX={600}
                        scrollY={200}
                        canInput={true}
                    // code="debuglist"
                    // onSelectRow={selectedRows => this.handleStateChange([{ selectedRows }])}
                    />
                </AntdForm>
            </div>
        );
    }
}
