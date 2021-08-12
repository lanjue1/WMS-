import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';;
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, Status, formatStatus } from './utils';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton'
import { transferLanguage, columnConfiguration } from "@/utils/utils";
// import { languages } from 'monaco-editor';
import {allDictList } from '@/utils/common'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ billType, common, component, loading, i18n }) => ({
    billType,
    loading: loading.effects['billType/billTypeList'],
    dictObject: common.dictObject,
    searchValue: component.searchValue,
    language: i18n.language
}))
@Form.create()
export default class WarehouseList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        isAbled: '',
        _Status: [],
    };
    className = 'billType';

    //列表 列
    columns = [{
        title: '#',
        dataIndex: 'index',
        render: (text, record, index) => (<span>{index + 1}</span>),
        width: 50
    },
    {
        //标题
        //title: '编码',
        title: transferLanguage('BillTypeList.field.code', this.props.language),
        //数据字段
        dataIndex: 'code',
        // render: (text, record) => (
        //     <a onClick={e => this.handleEdit(e, record)} title={text}>
        //         {text}
        //     </a>
        // ),
        width: 150,
    },
    {
        //title: '名称',
        title: transferLanguage('BillTypeList.field.name', this.props.language),
        dataIndex: 'name',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        //title: '状态',
        title: transferLanguage('BillTypeList.field.beActive', this.props.language),
        dataIndex: 'status',
        render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
        width: 100,
    },
    {
        //title: '业务类型',
        title: transferLanguage('BillTypeList.field.businessType', this.props.language),
        dataIndex: 'businessType',
        render: text => <AdSelect value={text} onlyRead={true} />,

    },
    {
        //title: '流水规则号',
        title: transferLanguage('BillTypeList.field.sequenceId', this.props.language),
        dataIndex: 'sequenceId',
        render: text => <AdSelect value={text} onlyRead={true} />,

    },
    {
        //title: '创建人名称',
        title: transferLanguage('BillTypeList.field.createBy', this.props.language),
        dataIndex: 'createBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        //title: '创建时间',
        title: transferLanguage('BillTypeList.field.createTime', this.props.language),
        dataIndex: 'createTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        //title: '备注',
        title: transferLanguage('BillTypeList.field.remarks', this.props.language),
        dataIndex: 'remarks',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        //title: '修改人名称',
        title: transferLanguage('BillTypeList.field.updateBy', this.props.language),
        dataIndex: 'updateBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        //title: '修改时间',
        title: transferLanguage('BillTypeList.field.updateTime', this.props.language),
        dataIndex: 'updateTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    ];
    componentDidMount() {
        this.getWarehouseList();
        this.setState({
            _Status: columnConfiguration(Status, this.props.language)

        })
    }

    getWarehouseList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'billType/billTypeList',
            payload: params,
            callback: data => {
                if (!data) return;
                let valueList = [];
                data.map(v => {
                    const labels = ['senderId'];
                    labels.map(item => {
                        if (v[item] && !valueList.includes(v[item])) {
                            valueList.push(v[item]);
                            !searchValue[v[item]] &&
                                dispatch({
                                    type: 'component/querySearchValue',
                                    payload: {
                                        params: { id: v[item] },
                                        url: 'sms/sms-sender/viewSmsSenderDetails',
                                    },
                                });
                        }
                    });
                });
            },
        });
    };

    //重置
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        this.getWarehouseList();
    };

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

    handleSelectRows = rows => {
        let ids = [];
        if (Array.isArray(rows) && rows.length > 0) {
            rows.map((item, i) => {
                ids.push(item.id);
            });
        }
        this.setState({
            selectedRows: rows,
            checkIds: ids,
        });
    };

    //查询
    handleSearch = values => {
        const { businessType, ...value } = values;
        if (businessType) value.businessType = [businessType]
        this.setState({
            formValues: value,
        });
        this.getWarehouseList(value);
    };

    //新建
    handleAdd = () => {
        const { dispatch } = this.props;
        router.push(`/basicData/listbillType/addbillType`);
    };

    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getWarehouseList(params);
    };

    //编辑：
    handleEdit = (e, record) => {
        e.stopPropagation();
        const { dispatch } = this.props;
        const { id } = record;
        // console.log('senderId', record.senderId);

        dispatch({
            type: 'billType/billTypeDetails',
            payload: { id },
            callback: res => {
                this.setState({
                    isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
                });
            },
        });
        router.push(`/basicData/listbillType/editbillType/${id}`);
    };

    //启用、禁用：
    abledStatus = (type, isSingle) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.ids = isSingle ? [checkId] : checkIds;
        params.type = type == 'abled' ? true : false;
        dispatch({
            type: 'billType/ableOperate',
            payload: params,
            callback: res => {
                this.getWarehouseList(formValues);

                if (isSingle) {
                    this.props.dispatch({
                        type: 'billType/billTypeDetails',
                        payload: { id: checkId },
                        callback: res => {
                            this.setState({
                                isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
                            });
                        },
                    });
                }
            },
        });
    };

    render() {
        const {
            loading,
            billType: { billTypeList, billTypeDetails },
            form,
            isMobile,
            dictObject,
            language,
        } = this.props;
        const { getFieldDecorator } = form;
        const {
            selectedRows,
            isAbled,
            checkId,
            visible,
            rowDetails,
            expandForm,
            _Status,
        } = this.state;

        const selectDetails = billTypeDetails[checkId];
        const firstFormItem = (
            <FormItem label={transferLanguage('Common.field.code', language)}>
                {getFieldDecorator('code')(<Input placeholder="" />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('Common.field.name', language)}>
                {getFieldDecorator('name')(<Input placeholder="" />)}
            </FormItem>
        );

        // secondForm 参数
        const otherFormItem = [
            [
                <FormItem label={transferLanguage('Common.field.status', language)}>
                    {getFieldDecorator('status')(
                       <AdSelect payload={{ code: allDictList.BasicData_Status }} />
                    )}
                </FormItem>,
            ],
            [<FormItem label={transferLanguage('BillTypeList.field.businessType', language)}>
                {getFieldDecorator('businessType')(<Input placeholder="" />)}
            </FormItem>, 'operatorButtons',]
        ];
        const selectFormParams = {
            firstFormItem,
            secondFormItem,
            otherFormItem,
            form,
            className: this.className,
            handleFormReset: this.handleFormReset,
            handleSearch: this.handleSearch,
            toggleForm: this.toggleForm,
            quickQuery: true

        };
        const tableButtonsParams = {
            show: true,
            // handleAdd: this.handleAdd,
            buttons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.abledStatus('disabled')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Common.field.disable', language)}
                        code={codes.disabled}
                    />
                    <AdButton
                        onClick={() => this.abledStatus('abled')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Common.field.enable', language)}
                        code={codes.enable}
                    />
                </Button.Group>
            ),
            selectedRows: selectedRows,
        };

        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={billTypeList}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                />
            </Fragment>
        );
    }
}
