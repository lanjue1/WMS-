import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Divider } from 'antd';
import { withRouter } from 'umi';
import moment, { isDate } from 'moment';
import prompt from '@/components/Prompt';
import StandardTable from '@/components/StandardTable';
import AntdInput from '@/components/AntdInput';
import AdSelect from '@/components/AdSelect';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import AntdDatePicker from '@/components/AntdDatePicker';
import FileReader from '@/components/FileReader';
import AntdSelectRegion from '@/components/AntdSelectRegion';
import SearchSelect from '@/components/SearchSelect';
import { allDictList } from '@/utils/constans';
import { queryDict, filterAddFile, filterDeteteFile, formatPrice } from '@/utils/common';

import {
    selectArchivesDetailAndInfo,
    allDispatchType,
    renderTableAdSelect,
    codes,
    beActiveList
} from './utils';
import styles from './index.less';

const dateFormat = 'YYYY-MM-DD';

@connect(({ dataAuthority, component, loading }) => ({
    dictObject: component.dictObject,
    dataDetail: dataAuthority.dataDetail,
    dataAuthorityList: dataAuthority.dataAuthorityList,
    loading: loading.effects[allDispatchType.detail],
}))
@Form.create()
@withRouter
export default class PressureInfo extends Component {
    constructor(props) {
        super(props);
        const {
            form: { getFieldDecorator },
        } = props;
        this.state = {
            detailId: '',
            preData: {},
        };
        this.commonParams = {
            getFieldDecorator,
        };
    }
    // beActive (boolean, optional): 是否有效（0 无效，1 有效） ,
    // filterName (string, optional): 过滤项名称 ,
    // filterValue (string, optional): 过滤项值（sql表达式） ,
    // id (string, optional): id ,
    // remarks (string, optional): 备注
    columns = [
        {
            title: '过滤项名称',
            dataIndex: 'filterName',
            width: 100,
            render: (text, record) => {
                const { onlyRead, disabled } = this.props;
                if (!onlyRead) {
                    return (
                        <AntdFormItem
                            label=" "
                            code={`filterName-${record.id}`}
                            {...this.commonParams}
                            initialValue={text}
                            rules={[{ required: true }]}
                        >
                            <AntdInput disabled={disabled} placeholder=""
                                onChange={value => this.handleFieldChange(value, 'filterName', record.id)}
                            />
                        </AntdFormItem>
                    );
                }
                return <span title={text}>{text}</span>;
            },
        },
        {
            title: '过滤项值',
            dataIndex: 'filterValue',
            width: 100,
            render: (text, record) => {
                const { onlyRead, disabled } = this.props;
                if (!onlyRead) {
                    return (
                        <AntdFormItem
                            label=" "
                            code={`filterValue-${record.id}`}
                            {...this.commonParams}
                            initialValue={text}
                            rules={[{ required: true }]}
                        >
                            <AntdInput disabled={disabled} placeholder=""
                                onChange={value => this.handleFieldChange(value, 'filterValue', record.id)}
                            />
                        </AntdFormItem>
                    );
                }
                return <span title={text}>{text}</span>;
            },
        },
        // {
        //     title: '是否有效',
        //     dataIndex: 'beActive',
        //     width: 120,
        //     render: (text, record) => {
        //         const { dictObject, onlyRead, disabled } = this.props;
        //         if (!onlyRead) {
        //             return (
        //                 <AntdFormItem
        //                     label=" "
        //                     code={`beActive-${record.id}`}
        //                     initialValue={text}
        //                     {...this.commonParams}
        //                     rules={[{ required: true }]}
        //                 >
        //                     <AdSelect
        //                         disabled={disabled}
        //                         isExist={true}
        //                         data={beActiveList}
        //                         onChange={value => this.handleFieldChange(value, 'beActive', record.id)}
        //                     />
        //                 </AntdFormItem>
        //             );
        //         }
        //         return renderTableAdSelect({
        //             props: this.props,
        //             value: text,
        //             data: beActiveList
        //         });
        //     },
        // },
        {
            title: '备注',
            dataIndex: 'remarks',
            width: 220,
            render: (text, record) => {
                const { disabled, onlyRead } = this.props;
                if (!onlyRead) {
                    return (
                        <AntdFormItem
                            label=" "
                            code={`remarks-${record.id}`}
                            initialValue={text}
                            {...this.commonParams}
                        >
                            <AntdInput
                                type="textarea"
                                // value={text}
                                rows={1}
                                disabled={disabled}
                                onChange={value => this.handleFieldChange(value, 'remarks', record.id)}
                            />
                        </AntdFormItem>
                    );
                }
                return <span title={text}>{text}</span>;
            },
        },
    ];

    componentWillMount() {
        const { dispatch, detailId } = this.props;
        this.saveAllValue({ dataAuthorityList: { [detailId]: { list: [] } } });
        // const allDict = [allDictList.archives_place];
        // queryDict({ props: this.props, allDict });
    }

    componentDidMount() {
        const { detailId, dataAuthorityList, onRef } = this.props;

        const id = detailId;
        onRef && onRef(this);
        if (!id) return;
        this.handleStateChange([{ detailId: id }]);
        const detail = dataAuthorityList[id];
        // if (detail) return;
        // this.dataAuthorityList(id);
    }

    componentWillReceiveProps(nextProps, nextState) {
        const { dataAuthorityList } = nextProps;
        const id = nextProps.detailId;
        const { detailId } = nextState;
        if (
            !id &&
            !this.state.detailId &&
            (!detailId || (detailId && detailId === '')) &&
            !dataAuthorityList[this.state.detailId]
        ) {
            this.saveAllValue({
                dataAuthorityList: { [this.state.detailId]: { list: [this.getAddDataObj()] } },
            });
        }
        if (this.props.detailId !== id) {
            this.handleStateChange([{ detailId: id }]);
            // this.dataAuthorityList(id);
        }
    }

    // dataAuthorityList = (id, payload) => {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: allDispatchType.dataAuthorityList,
    //         payload: { id, ...payload },
    //         callback: data => {
    //         },
    //     });
    // };

    getAddDataObj = () => {
        return {
            id: `isNew${Math.ceil(Math.random() * 10000) + 10000}`,
            filterName: '',
            filterValue: '',
            remarks: '',
            // beActive: '',
        };
    };

    addInfo = () => {
        const { detailId } = this.state;
        let newData = this.getInfoData();
        newData = [this.getAddDataObj(), ...newData];
        this.saveAllValue({ dataAuthorityList: { [detailId]: { list: newData } } });
    };

    getInfoData = () => {
        const { dataAuthorityList } = this.props;
        const { detailId } = this.state;
        let newData = [];
        if (dataAuthorityList[detailId]) {
            const data = dataAuthorityList[detailId].list;
            newData = data.map(item => ({ ...item }));
        }
        return newData;
    };

    getRowByKey(id, newData) {
        const data = this.getInfoData();
        return (newData || data).filter(item => item.id === id)[0];
    }

    handleFieldChange(value, fieldName, id) {
        const { dispatch, form, showTipsFun, trainInfoList, detailId } = this.props;
        showTipsFun(true);
        const newData = this.getInfoData();
        const target = this.getRowByKey(id, newData);
        if (target) {
            target[fieldName] = value;
        }

        this.saveAllValue({ dataAuthorityList: { [detailId]: { list: newData } } });
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
            dataAuthorityList,
            loading,
            onSelectRow,
            selectedRows,
            detailId,
            disabled,
        } = this.props;
        const data = dataAuthorityList[detailId] || {};
        
        return (
            <div className={styles.customPartsOfferInfo}>
                <AntdForm>
                    <StandardTable
                        loading={loading}
                        data={data}
                        columns={this.columns}
                        // selectedRows={selectedRows}
                        disabledRowSelected={true} //disabled
                        pagination={false}
                        scrollX={900}
                        scrollY={200}
                        canInput={true}
                    // onSelectRow={selectedRows => {
                    //     onSelectRow(selectedRows);
                    // }}
                    />
                </AntdForm>
            </div>
        );
    }
}
