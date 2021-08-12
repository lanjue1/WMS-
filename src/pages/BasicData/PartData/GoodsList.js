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
import { transferLanguage } from '@/utils/utils';
import AdButton from '@/components/AdButton';
import FileImport from '@/components/FileImport'
import {allDictList } from '@/utils/common'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ goods, common, component, loading, i18n }) => ({
    goods,
    loading: loading.effects['goods/goodsList'],
    dictObject: common.dictObject,
    searchValue: component.searchValue,
    language: i18n.language,
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
    className = 'goods';

    //列表 列
    columns = [{
        title: '#',
        dataIndex: 'index',
        render: (text, record, index) => (<span>{index + 1}</span>),
        width: 50
    },
    {
        //标题
        title: transferLanguage('InventoryLog.field.partName', this.props.language),//'料号'
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
        title: transferLanguage('partData.field.status', this.props.language),//'状态',
        dataIndex: 'status',
        render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
        width: 130,
    },
    // {
    //     title: transferLanguage('partData.field.shortName', this.props.language),//'简称',
    //     dataIndex: 'shortName',
    //     render: text => <AdSelect value={text} onlyRead={true} />,
    //     width: 180
    // },
    {
        title: transferLanguage('InventoryList.field.partName', this.props.language),//'名称',
        dataIndex: 'name',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 180

    },
    // {
    //     title: transferLanguage('partData.field.enName', this.props.language),//'英文名称',
    //     dataIndex: 'enName',
    //     render: text => <span>{text}</span>,
    //     width: 300,
    // },
    {
        title: transferLanguage('partData.field.barCode', this.props.language),//'条形码',
        dataIndex: 'barCode',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    // {
    //     title: '类型ID',
    //     dataIndex: 'itmeTypeId',
    //     render: text => <AdSelect value={text} onlyRead={true} />,
    // },
    {
        title: transferLanguage('partData.field.itmeType', this.props.language),//'类型',
        dataIndex: 'itemTypeName',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },

    {
        title: transferLanguage('Logistics.field.partCC', this.props.language),//'描述',
        dataIndex: 'commodity',
        render: text => <span>{text}</span>,
        width: 130,
    },

    {
        title: transferLanguage('Logistics.field.commodityDesc', this.props.language),//'POSI机料号',
        dataIndex: 'commodityDesc',
        render: text => <span>{text}</span>,
        width: 180,
    },
    {
        title: transferLanguage('partData.field.werks', this.props.language),//'联想Location',
        dataIndex: 'werks',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,
    },
    {
        title: transferLanguage('partData.field.coo', this.props.language),//'原产国',
        dataIndex: 'coo',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.spec', this.props.language),//'规格',
        dataIndex: 'spec',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.storageType', this.props.language),//'存储类型',
        dataIndex: 'storageType',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.uom', this.props.language),//'计量单位',
        dataIndex: 'uom',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.length', this.props.language),//'长',
        dataIndex: 'length',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.width', this.props.language),//'宽',
        dataIndex: 'width',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.heigth', this.props.language),//'高',
        dataIndex: 'heigth',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },

    {
        title: transferLanguage('partData.field.grossWeight', this.props.language),//'毛重',
        dataIndex: 'grossWeight',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.grossWeightUnit', this.props.language),//'毛重单位',
        dataIndex: 'grossWeightUnit',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.netWeight', this.props.language),//'净重',
        dataIndex: 'netWeight',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.netWeightUnit', this.props.language),//'净重单位',
        dataIndex: 'netWeightUnit',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.volume', this.props.language),//'体积',
        dataIndex: 'volume',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.volumeUnit', this.props.language),//'体积单位',
        dataIndex: 'volumeUnit',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.price', this.props.language),//'单价',
        dataIndex: 'price',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.remarks', this.props.language),//'备注',
        dataIndex: 'remarks',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },

    {
        title: transferLanguage('partData.field.createBy', this.props.language),//'创建人',
        dataIndex: 'createBy',
        render: text => <span title={text}>{text}</span>,
        width: 200,
    },
    {
        title: transferLanguage('partData.field.createTime', this.props.language),//'创建时间',
        dataIndex: 'createTime',
        render: text => <span title={text}>{text}</span>,
        width: 200,
    },
    {
        title: transferLanguage('partData.field.updateBy', this.props.language),//'更新人',
        dataIndex: 'updateBy',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },
    {
        title: transferLanguage('partData.field.updateTime', this.props.language),//'更新时间',
        dataIndex: 'updateTime',
        render: text => <AdSelect value={text} onlyRead={true} />,
        width: 130,

    },

        // {
        //     title: '所属仓库id',
        //     dataIndex: 'warehouseId',
        //     render: text => <AdSelect value={text} onlyRead={true} />,
        // },


    ];
    componentDidMount() {
        this.getWarehouseList();
      
    }

    getWarehouseList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'goods/goodsList',
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
        router.push(`/basicData/listGoods/addGoods`);
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
            type: 'goods/goodsDetails',
            payload: { id },
            callback: res => {
                this.setState({
                    isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
                });
            },
        });
        router.push(`/basicData/listGoods/editGoods/${id}`);
    };

    //启用、禁用：
    abledStatus = (type, isSingle) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {
            type
        };
        params.ids = isSingle ? [checkId] : checkIds;
        dispatch({
            type: 'goods/ableOperate',
            payload: params,
            callback: res => {
                this.getWarehouseList(formValues);

                if (isSingle) {
                    this.props.dispatch({
                        type: 'goods/goodsDetails',
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
    print = () => {
        const { checkIds, selectedRows } = this.state
        const { dispatch } = this.props
        let id = selectedRows[0]?.id
        dispatch({
            type: 'common/setPrint',
            payload: { ids: checkIds },
            callback: data => {
                router.push(`/print/${id}/PARTDATA`);
            }
        })
    }
    render() {
        const {
            loading,
            goods: { goodsList, goodsDetails },
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
        } = this.state;

        const selectDetails = goodsDetails[checkId];
        const firstFormItem = (
            <FormItem label={transferLanguage('InventoryLog.field.partName', language)}>
                {getFieldDecorator('code')(<Input placeholder="" />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('InventoryList.field.partName', language)}>
                {getFieldDecorator('name')(<Input placeholder="" />)}
            </FormItem>
        );

        // secondForm 参数
        const otherFormItem = [
            [
                <FormItem label={transferLanguage('partData.field.status', language)}>
                    <AdSelect payload={{ code: allDictList.BasicData_Status }} />
                </FormItem>,
            ],
            [<FormItem label={transferLanguage('partData.field.barCode', language)}>
                {getFieldDecorator('barCode')(<Input placeholder="" />)}
            </FormItem>,
            <FormItem label={transferLanguage('Logistics.field.partCC', language)}>
                {getFieldDecorator('commodity')(<Input placeholder="" />)}
            </FormItem>,
            ],
            ['operatorButtons']
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
            rightButtons: (
                <Button.Group>
                    <AdButton
                        code={codes.disabled}
                        onClick={() => this.setState({ visible: true })}
                        text={transferLanguage('Common.field.import', language)}
                    />
                </Button.Group>
            ),
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

                    <AdButton
                        onClick={() => this.print()}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('PartData.button.printPartNo', language)}
                        code={codes.printPN}
                    />

                </Button.Group>
            ),
            selectedRows: selectedRows,
        };

        return (
            <Fragment>
                <FileImport
                    visibleFile={visible}
                    handleCancel={() =>this.setState({visible:false})}
                    urlImport={`wms-part/importWmsPart`}
                    urlCase={`template/download?fileName=importPartTemplate.xlsx`}
                    queryData={[this.getWarehouseList]}
                    accept=".xls,.xlsx"
                />
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={goodsList}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    // expandForm={expandForm}
                    expandForm={false}
                    className={this.className}
                // code={codes.page}
                />
            </Fragment>
        );
    }
}
