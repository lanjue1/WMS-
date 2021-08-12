import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Button ,Switch} from 'antd';
import StandardTable from '@/components/StandardTable';;
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, Status, formatStatus } from './utils';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton'
import { transferLanguage } from '@/utils/utils';
import {allDictList } from '@/utils/common'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ warehouse, common, component, loading, i18n }) => ({
    warehouse,
    loading: loading.effects['warehouse/warehouseList'],
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
    };
    className = 'warehouse';

    language = this.props.language

    //列表 列
    columns = [{
        title: '#',
        dataIndex: 'index',
        render: (text, record, index) => (<span>{index + 1}</span>),
        width: 50
    },
    {
        //标题
        // title: '编码',
        title: transferLanguage('WarehouseList.field.code', this.language),
        //数据字段
        dataIndex: 'code',
        render: (text, record) => (
            <a onClick={e => this.handleEdit(e, record)} title={text}>
                {text}
            </a>
        ),
        width: 150,
    },
    {
        title: transferLanguage('WarehouseList.field.address', this.language),
        dataIndex: 'address',
        render: text => <span title={text}>{text}</span>,
        width: 200,
    },
    {
        title: transferLanguage('WarehouseList.field.contactName', this.language),
        dataIndex: 'contactName',
        render: text => <span title={text}>{text}</span>,
        width: 150,
    },
    {
        title: transferLanguage('WarehouseList.field.autoLock', this.language),
        dataIndex: 'autoLock',
        render: (text,record) => <Switch defaultChecked={text}  onChange={(checked)=>this.changeSwitch(checked,record)}/>,
        width: 100,
    },
    {
        title: transferLanguage('WarehouseList.field.status', this.language),
        dataIndex: 'status',
        // render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
        width: 100,
    },
    {
        title: transferLanguage('WarehouseList.field.country', this.language),
        dataIndex: 'countryName',
        render: text => <span>{text}</span>,
        width: 100,
    },
    {
        title: transferLanguage('WarehouseList.field.createBy', this.language),
        dataIndex: 'createBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('WarehouseList.field.createTime', this.language),
        dataIndex: 'createTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('WarehouseList.field.description', this.language),
        dataIndex: 'description',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('WarehouseList.field.mobile', this.language),
        dataIndex: 'mobile',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('WarehouseList.field.name', this.language),
        dataIndex: 'name',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('WarehouseList.field.postcode', this.language),
        dataIndex: 'postcode',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('WarehouseList.field.remarks', this.language),
        dataIndex: 'remarks',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('WarehouseList.field.timeZone', this.language),
        dataIndex: 'timeZone',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('WarehouseList.field.updateBy', this.language),
        dataIndex: 'updateBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('WarehouseList.field.updateTime', this.language),
        dataIndex: 'updateTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('WarehouseList.field.warehouseType', this.language),
        dataIndex: 'warehouseType',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('WarehouseList.field.warehouseTag', this.language),
        dataIndex: 'warehouseTag',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    ];
    componentDidMount() {
        this.getWarehouseList();
    }
    changeSwitch=(checked,record)=>{
        // console.log('checked',checked,record)
        const {dispatch}=this.props
        const { formValues}=this.state
        const params={
            type:'autoLock',
            id:record.id,
            autoLock:checked,
        }
        dispatch({
            type:'warehouse/ableOperate',
            payload:params,
            callback:()=>{
                this.getWarehouseList(formValues);
            }
        })
    }
    getWarehouseList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'warehouse/warehouseList',
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
        const { ...value } = values;
        this.setState({
            formValues: value,
        });
        this.getWarehouseList(value);
    };

    //新建
    handleAdd = () => {
        const { dispatch } = this.props;
        router.push(`/basicData/listWareHouse/addWareHouse`);
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
            type: 'warehouse/warehouseDetails',
            payload: { id },
            callback: res => {
                this.setState({
                    isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
                });
            },
        });
        router.push(`/basicData/listWareHouse/editWareHouse/${id}`);
    };

    //启用、禁用：
    abledStatus = (type,) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.ids = checkIds;
        params.type = type 
        dispatch({
            type: 'warehouse/ableOperate',
            payload: params,
            callback: res => {
                this.getWarehouseList(formValues);

               
            },
        });
    };

    render() {
        const {
            loading,
            warehouse: { warehouseList, warehouseDetails },
            form,
            isMobile,
            dictObject,
            language
        } = this.props;
        const { getFieldDecorator } = form;
        const {
            selectedRows,
            isAbled,
            checkId,
            visible,
            rowDetails,
            expandForm
        } = this.state;

        const selectDetails = warehouseDetails[checkId];
        const firstFormItem = (
            <FormItem label={transferLanguage('WarehouseList.field.code', language)}>
                {getFieldDecorator('code')(<Input placeholder="" />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('WarehouseList.field.name', language)}>
                {getFieldDecorator('name')(<Input placeholder="" />)}
            </FormItem>
        );

        // secondForm 参数
        const otherFormItem = [
            [
                <FormItem label={transferLanguage('WarehouseList.field.status', language)}>
                    {getFieldDecorator('status')(
                        <AdSelect payload={{ code: allDictList.BasicData_Status }} />

                    )}
                </FormItem>,
            ],
            [<FormItem label={transferLanguage('WarehouseList.field.country', language)}>
                {getFieldDecorator('countryId')(<Input placeholder="" />)}
            </FormItem>, 
            ],
            ['operatorButtons',]
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
            handleAdd: this.handleAdd,
            code:codes.add,
            buttons: (
                <Button.Group>
                    <AdButton
                        text={transferLanguage('Common.field.disabled', language)}
                        code={codes.disabled}
                        onClick={() => this.abledStatus('disabled')}
                        disabled={selectedRows.length > 0 ? false : true}
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
                    data={warehouseList}
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
