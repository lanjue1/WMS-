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
@connect(({ country, common, component, loading, i18n }) => ({
    country,
    loading: loading.effects['country/countryList'],
    dictObject: common.dictObject,
    searchValue: component.searchValue,
    language: i18n.language
}))
@Form.create()
export default class CountryList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        isAbled: '',
        _Status: [],
    };
    className = 'country';

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
        title: transferLanguage('CountryList.field.code', this.props.language),
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
        //title: '名称'
        title: transferLanguage('CountryList.field.name', this.props.language),
        dataIndex: 'name',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('CountryList.field.beActive', this.props.language),
        dataIndex: 'status',
        render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
        width: 100,
    },
    {
        title: transferLanguage('CountryList.field.createBy', this.props.language),
        dataIndex: 'createBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('CountryList.field.createTime', this.props.language),
        dataIndex: 'createTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('CountryList.field.remarks', this.props.language),
        dataIndex: 'remarks',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('CountryList.field.updateBy', this.props.language),
        dataIndex: 'updateBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('CountryList.field.updateTime', this.props.language),
        dataIndex: 'updateTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    ];
    componentDidMount() {
        this.getCountryList();
        this.setState({
            _Status: columnConfiguration(Status, this.props.language)
        })
    }

    getCountryList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'country/countryList',
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
        this.getCountryList();
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
        this.getCountryList(value);
    };

    //新建
    handleAdd = () => {
        const { dispatch } = this.props;
        router.push(`/basicData/listCountry/addCountry`);
    };

    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { dispatch } = this.props;
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getCountryList(params);
    };

    //编辑：
    handleEdit = (e, record) => {
        e.stopPropagation();
        const { dispatch } = this.props;
        const { id } = record;
        // console.log('senderId', record.senderId);

        dispatch({
            type: 'country/countryDetails',
            payload: { id },
            callback: res => {
                this.setState({
                    isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
                });
            },
        });
        router.push(`/basicData/listCountry/editCountry/${id}`);
    };

    //启用、禁用：
    abledStatus = (type, isSingle) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {};
        params.ids = isSingle ? [checkId] : checkIds;
        params.type = type == 'abled' ? true : false;
        dispatch({
            type: 'country/ableOperate',
            payload: params,
            callback: res => {
                this.getCountryList(formValues);

                if (isSingle) {
                    this.props.dispatch({
                        type: 'country/countryDetails',
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
            country: { countryList, countryDetails },
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
            _Status
        } = this.state;

        const selectDetails = countryDetails[checkId];
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
                </FormItem>
            ], ['operatorButtons']
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
            code: codes.add,
            buttons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.abledStatus('disabled')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('CountryList.button.disable', this.props.language)}
                        codes={codes.disabled}
                    />
                    <AdButton
                        onClick={() => this.abledStatus('abled')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('CountryList.button.enable', this.props.language)}
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
                    data={countryList}
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
