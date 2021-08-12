import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Spin, Tabs, Collapse, Select } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdModal from '@/components/AdModal'
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import EditPage from '@/components/EditPage';
import DetailsList from '@/components/DetailsList'
import AntdForm from '@/components/AntdForm';
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { transferLanguage, columnConfiguration } from '@/utils/utils'
import SearchSelect from '@/components/SearchSelect';
import styles from '@/pages/Operate.less';

import { formItemFragement, allDictList } from '@/utils/common';
import { queryFileList, filterAddFile, filterDeteteFile } from '@/utils/common';

import BaseInfoForm from './components/BaseInfoForm'
import TrainingForm from './components/TrainingForm'
import ExtraForm from './components/ExtraForm'
import CustomsForm from './components/CustomsForm'
import AddPartsForm from './components/AddPartsForm'
import {
    allDispatchType,
    codes,
    formType,
    currencyData,

    columnsPackage,
    columnsBill,
} from './utils';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;
const { TabPane } = Tabs;
const { Panel } = Collapse
const { TextArea } = Input
// @ManageList

@connect(({ ASN, loading, i18n }) => ({
    ASN,
    asnDetails: ASN.asnDetails,
    loading: loading.effects[allDispatchType.detail],
    language: i18n.language,
}))
@Form.create()
export default class ASNDetail extends Component {
    className = 'ASNDetail'
    state = {
        disabled: true,
        key: 1,
        key2: 1,
        activeKey: ['1', '2', '3'],
        expandForm: false,
        detailId: '',
        whichForm: '',
        allFormParams: {},
        // saveDisable:true, // 用来控制 总保存按钮，必须保存表格之后才能使用
        defaultKey: true,// tabs1 未切换时为true，切换了为false
        _columnsParts: [],
        _columnsPackage: [],
        _columnsBill: [],

        // selectedRowsParts:[],
        // selectedRowsPackage:[],
        selectedRowsBill: [],
        isError: false, // 用于判断 form校验
        isPackage: false, //用于判断是否切换的是包装明细 ，不是的话，不显示 移除添加按钮
        checkIdsBill: [],
        checkIdsParts: [],
        visibleParts: false,
        partdetail: {},

    }
    columnsParts = [
        {
            title: '#',
            dataIndex: 'index',
            render: (text, record, index) => (<span>{index + 1}</span>),
            width: 50
        },
        {
            title: transferLanguage('ASN.field.partNo',this.props.language),
            dataIndex: 'partNo',
            render: (text, record) => (<a onClick={() => this.setState({ partdetail: record, visibleParts: true })} title={text}>{text}</a>),
            width: 150,
        },
        {
            title: transferLanguage('Common.field.status',this.props.language),
            dataIndex: 'status',
            width: 100,
        },
        {
            title: transferLanguage('ASN.field.putawayStauts',this.props.language),
            dataIndex: 'putawayStauts',
            width: 100,
        },
        {
            title: transferLanguage('ASN.field.qualityTag',this.props.language),
            dataIndex: 'qualityTag',
            //表格列的宽度
            width: 100,
            // render: (text, record) => (
            //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
            // ),
        },

        {
            title: transferLanguage('ASN.field.beSn',this.props.language),
            dataIndex: 'beSn',
            width: 100,
        },

        {
            title:transferLanguage('ASN.field.cargoOwner',this.props.language),
            dataIndex: 'cargoOwnerId',
            width: 120,
        },
        {
            title: transferLanguage('ASN.field.poNo',this.props.language),
            dataIndex: 'poNo',
            width: 120,
        },
        {
            title:transferLanguage('ASN.field.poDetail',this.props.language),
            dataIndex: 'poDetailId',
            width: 120,
        },
        {
            title: transferLanguage('ASN.field.samplingUnit',this.props.language),
            dataIndex: 'samplingUnit',
            width: 120,

        },
        {
            title: transferLanguage('ASN.field.planOrActPcsQty',this.props.language),
            dataIndex: 'planPcsQty',
            width: 120,
            render: (text, record) => (<span>{text} | {record.actualPcsQty}</span>)
        },
        {
            title:transferLanguage('ASN.field.planOrActInnerQty',this.props.language),
            dataIndex: 'planInnerQty',
            width: 120,
            render: (text, record) => (<span>{text} | {record.actualInnerQty}</span>)
        },

        {
            title: transferLanguage('ASN.field.planOrActBoxQty',this.props.language),
            dataIndex: 'planBoxQty',
            width: 120,
            render: (text, record) => (<span>{text} | {record.actualBoxQty}</span>)

        },
        {
            title: transferLanguage('ASN.field.planOrActPalletQty',this.props.language),
            dataIndex: 'planPalletQty',
            width: 120,
            render: (text, record) => (<span>{text} | {record.actualPalletQty}</span>)

        },
        {
            title:transferLanguage('ASN.field.planOrActVolume',this.props.language),
            dataIndex: 'planVolume',
            width: 120,
            render: (text, record) => (<span>{text} | {record.actualVolume}</span>)

        },
        {
            title: transferLanguage('ASN.field.planOrActGrossWeight',this.props.language),
            dataIndex: 'planGrossWeight',
            width: 120,
            render: (text, record) => (<span>{text} | {record.actualGrossWeight}</span>)

        }, {
            title: transferLanguage('ASN.field.planOrActNetWeight',this.props.language),
            dataIndex: 'planNetWeight',
            width: 120,
            render: (text, record) => (<span>{text} | {record.actualNetWeight}</span>)

        },
        {
            title: transferLanguage('ASN.field.lotCurrency',this.props.language),
            dataIndex: 'lotCurrency',
            width: 120,
        },
        {
            title: transferLanguage('ASN.field.lotUnitPrice',this.props.language),
            dataIndex: 'lotUnitPrice',
            width: 100,
        },
        {
            title:transferLanguage('ASN.field.lotCoo',this.props.language),
            dataIndex: 'lotCoo',
            width: 100,
        },
        {
            title:transferLanguage('ASN.field.lotVendorPart',this.props.language),
            dataIndex: 'lotVendorPart',
            width: 100,
        },
        {
            title: transferLanguage('ASN.field.lotVendorCode',this.props.language),
            dataIndex: 'lotVendorCode',
            width: 100,
        },
        {
            title: transferLanguage('ASN.field.lotVendorName',this.props.language),
            dataIndex: 'lotVendorName',
            width: 100,
        },
        {
            title: transferLanguage('ASN.field.plant',this.props.language),
            dataIndex: 'lotPlant',
            width: 100,
        },
        {
            title: transferLanguage('ASN.field.sapLocation',this.props.language),
            dataIndex: 'lotSapLocation',
            width: 100,
        },

        {
            title: transferLanguage('ASN.field.lotDnNo',this.props.language),
            dataIndex: 'lotDnNo',
            width: 100,
        },
        {
            title: transferLanguage('ASN.field.inspectTime',this.props.language),
            dataIndex: 'inspectTime',
            width: 100,
        },
        {
            title: transferLanguage('ASN.field.inspectFinishedTime',this.props.language),
            dataIndex: 'inspectFinishedTime',
            width: 100,
        }, {
            title: transferLanguage('Common.field.updateTime',this.props.language),
            dataIndex: 'updateTime',
            width: 100,
        }, {
            title: transferLanguage('Common.field.updateBy',this.props.language),
            dataIndex: 'updateBy',
            width: 100,
        },
        {
            title: transferLanguage('Common.field.createBy',this.props.language),
            dataIndex: 'createBy',
            width: 100,
        },

    ];

    componentDidMount() {
        const { match, form, dispatch, location: { query }, } = this.props;
        const ID = match && match.params ? match.params.id : query.id
        // const ID=query.id
        // console.log('params',location,params)
        this.setState({
            detailId: ID,
            showRecord: true,
        }, () => {
            if (ID) {
                this.getDetail()
                this.getDetailList({ type: 'parts' })
                this.getDetailList({ type: 'package' })
                // this.getDetailList({ type: 'bill' })
            } else {
                this.setState({ disabled: false })
            }

        });

        this.setState({
            // _columnsParts: columnConfiguration(columnsParts, '_columnsParts'),
            _columnsPackage: columnConfiguration(columnsPackage, '_columnsPackage'),
            _columnsBill: columnConfiguration(columnsBill, '_columnsBill'),
        })
    }

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };
    tabsChange = (key) => {
        this.setState({ key, whichForm: formType[key - 1], defaultKey: false })
        this.checkSonValue()
    }
    tabsChange2 = (key) => {
        this.setState({ key2: key, isPackage: key == 2 ? true : false })
    }
    callback = key => {
        this.setState({
            activeKey: key,
        });
    };

    getDetailList = (params = {}) => {
        const { type, ...param } = params
        //type=parts/package/bill/... ==>partsList\packageList\billList
        const { dispatch } = this.props
        const { detailId } = this.state
        param.asnId = detailId
        dispatch({
            type: 'ASN/asnDetailList',
            payload: { type, ...param },
        })
    }
    getDetail = async () => {
        const { dispatch } = this.props
        const { detailId } = this.state
        detailId && dispatch({
            type: 'ASN/asnDetails',
            payload: { id: detailId },
        })
    }
    handleFormReset = () => {
        const { form, } = this.props
        this.setState({
            formValues: {},
        });
        form.resetFields();
        this.getDetailList({ type: 'parts' })
    };
    handleSearch = formValues => {
        const { poNoParts, partNoParts, statusParts, ...value } = formValues
        console.log('查询', value)
        const _value = {
            poNo: poNoParts,
            partNo: partNoParts,
            status: statusParts,
        }
        this.getDetailList({ _value, type: 'parts' })
        this.setState({ formValues: _value })
    };
    handleFormResetPackage = () => {
        const { form, } = this.props
        this.setState({
            formValuesPackage: {},
        });
        form.resetFields();
        this.getDetailList({ type: 'package' })
    };
    handleSearchPackage = formValues => {
        const { poNoParts, partNoParts, statusParts, ...value } = formValues
        this.getDetailList({ value, type: 'package' })
        this.setState({ formValuesPackage: value })
    };
    // 选中行
    handleSelectRows = (rows, type) => {
        const selectRows = {
            bill: 'selectedRowsBill',
            parts: 'selectedRowsParts'
        }
        const checkIds = {
            bill: 'checkIdsBill',
            parts: 'checkIdsParts',
        }
        let ids = [];
        if (Array.isArray(rows) && rows.length > 0) {
            rows.map((item, i) => {
                ids.push(item.id);
            });
        }
        this.setState({
            [selectRows[type]]: rows,
            [checkIds[type]]: ids,
        });

    };
    handleStandardTableChange = (param, type) => {
        const { formValues, formValuesPackage } = this.state;
        switch (type) {
            case 'parts':
                this.getDetailList({ ...formValues, ...param, type })
                break;
            case 'package':
                this.getDetailList({ ...formValuesPackage, ...param, type })
                break;
            case 'bill':
                this.getDetailList({ ...param, type })
        }
    }
    onRef = (ref, type) => {
        this.setState({ whichForm: type })
        switch (type) {
            case 'BaseInfo':
                this.childBase = ref;
                break;
            case 'Traning':
                this.childTrain = ref;
                break;
            case 'Customs':
                this.childCustoms = ref;
                break;
            case 'PartDetail':
                this.childPartDetail = ref
        }
    }

    getValue = (values, type) => {
        // console.log('getValue', values, type)
        this.setState({
            [type]: values
        })
        if (type === 'currency') {
            //币种切换重新调取详情接口
        }
    }
    ableOperate = (type, checkType) => {
        const { dispatch } = this.props
        const { detailId, checkIdsParts, checkIdsBill } = this.state
        const params = {
            type,
            ids: checkType == 'parts' ? checkIdsParts : checkType == 'bill' ? checkIdsBill : [detailId]
        }
        dispatch({
            type: 'ASN/ableOperate',
            payload: params,
            callback: res => {
                this.getDetailList({ type: 'parts' })
                this.getDetailList({ type: 'package' })
                // this.getDetailList({ type: 'bill' })  
            }
        })
    }
    checkSonValue = () => {
        const { whichForm } = this.state
        switch (whichForm) {
            case 'BaseInfo':
                this.childBase.getFormValues()
                break;
            case 'Traning':
                this.childTrain.getFormValues()
                break;
            case 'Customs':
                this.childCustoms.getFormValues()
                break;
        }
    }
    saveForms = (values, type, isError = false) => {
        const { allFormParams } = this.state
        type && this.setState({ allFormParams: { ...allFormParams, [type]: values } })
        isError && this.setState({ isError: true })
    }
    saveDetailForm = (values, type) => {
        const { detailId, partdetail } = this.state
        const { dispatch } = this.props
        values.type = partdetail && partdetail.id ? 'updateDetail' : 'insertDetail'
        if(partdetail && partdetail.id) values.id=partdetail.id
        values.asnId = detailId
        dispatch({
            type: 'ASN/ableOperate',
            payload: values,
            callback: () => {
                this.setState({ visibleParts: false, partdetail: {} })
                this.getDetailList({ type: 'parts' })
            }
        })
    }

    saveInfo = async () => {
        this.state.defaultKey && await this.childBase.getFormValues() // tabs1未切换触发表格保存时，手动触发表格保存事件，默认的表格是 基本信息表格
        const { asnDetails = {}, dispatch } = this.props
        const { detailId, allFormParams, isError } = this.state
        if (isError) return

        const params = {}
        //  处理附件
        const _fileToken = asnDetails[detailId] ? asnDetails[detailId].fileToken : []
        const _signForm = asnDetails[detailId] ? asnDetails[detailId].signForm : []

        const fileInfo = []
        let FileToken = allFormParams?.BaseInfo?.fileToken
        let SignForm = allFormParams?.Traning?.signForm

        if (FileToken && FileToken.length > 0) {
            fileInfo.push({
                fileBizType: 'ASNBaseInfo',
                // fieldName: 'fileToken',
                fileTokens: filterAddFile(FileToken),
                deleteFileIds: filterDeteteFile(FileToken, _fileToken)
            })
            //清空附件字段
            allFormParams.BaseInfo.fileToken = ''
        }
        if (SignForm && SignForm.length > 0) {
            fileInfo.push({
                fileBizType: 'ASNSignForm',
                // fieldName: 'signForm',
                fileTokens: filterAddFile(SignForm),
                deleteFileIds: filterDeteteFile(SignForm, _signForm)
            })
            allFormParams.Traning.signForm = ''
        }

        const newParams = { ...allFormParams.BaseInfo, ...allFormParams.Customs, ...allFormParams.Traning }
        newParams.fileInfo = fileInfo
        if (detailId) newParams.id = detailId
        dispatch({
            type: 'ASN/ableOperate',
            payload: { ...newParams, type: detailId ? 'saveAll' : 'insert' },
            callback: (data) => {
                this.getDetail()
                if (!detailId) {
                    dispatch({
                        type: 'common/setTabsName',
                        payload: {
                            id: data.data,
                            isReplaceTab: true,
                        },
                        callback: (result) => {
                            if (result) {
                                console.log('跳转', result)
                                router.push(`/inboundManagement/ASNDetail/edit/${data.data}`)
                            }
                        }
                    })
                }
            }
        })

    }

    extraCur = (type) => {
        if (type == 'second') {
            return <div onClick={(event) => event.stopPropagation()} style={{display:'flex'}}>
                <label style={{ width: '80px',  }}>{transferLanguage('ASN.field.lotCurrency',this.props.language)}:</label>
                <AdSelect payload={{ code: allDictList.currency }} style={{ width: '150px' }}
                    onChange={(values) => this.getValue(values, 'currency')} />
            </div>
        } else {
            return <div onClick={(event) => event.stopPropagation()}>
                {
                    !this.state.isPackage && !this.state.disabled ?
                        <Button.Group>
                            <AdButton text={transferLanguage('Common.field.remove',this.props.language)} type="danger" disabled={this.state.checkIdsParts.length > 0 ? false : true} ghost onClick={() => this.ableOperate('removeParts', 'parts')} />
                            <AdButton text={transferLanguage('Common.field.add',this.props.language)} type="primary" onClick={() => this.setState({ visibleParts: true, partdetail: {} })} />
                        </Button.Group> : ''
                }
            </div>
        }

    }
    addPartDetail = () => {
        this.childPartDetail.getFormValues()

    }
    render() {
        const { detail, asnDetails, match: { params }, form, location: { query },language,
            ASN: {
                partsList = { list: [{ id: 'jmm', binTypeCode: '12', allocatable: 'jss', planPcsQty: '5', actualPcsQty: '8' }] },
                packageList = { list: [] },
                billList = { list: [] },
            },
        } = this.props
        const {
            disabled,
            visibleParts,
            expandForm,
            selectedRowsParts,
            // selectedRowsPackage:[],
            selectedRowsBill,
        } = this.state
        const currentId = params.id;
        let selectDetails = currentId && asnDetails[currentId] || {};
        const commonParams = { getFieldDecorator: form.getFieldDecorator }
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('ASN.field.poNo',language)} code="poNoParts" {...commonParams}>
                <TextArea rows={1} />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('ASN.field.partNo',language)} code="partNoParts" {...commonParams}>
                <TextArea rows={1} />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('Common.field.status',language)} code="statusParts" {...commonParams}>
                    <AdSelect payload={{ code: allDictList.Buy_Ledger_OrderType }} />
                </AntdFormItem>,
            ],
            ['operatorButtons'],
        ];
        const selectFormParts = {
            firstFormItem,
            secondFormItem,
            otherFormItem,
            form,
            className: this.className,
            handleFormReset: this.handleFormReset,
            handleSearch: this.handleSearch,
            toggleForm: this.toggleForm,
            quickQuery: true
        }
        const firstFormItemPackage = (
            <AntdFormItem label={transferLanguage('ASN.field.containerNo',language)} code="containerNo" {...commonParams}>
                <TextArea rows={1} />
            </AntdFormItem>
        );
        const secondFormItemPackage = (
            <AntdFormItem label={transferLanguage('ASN.field.palletNo',language)} code="palletNo" {...commonParams}>
                <TextArea rows={1} />
            </AntdFormItem>
        );
        const otherFormItemPackage = [
            [
                <AntdFormItem label={transferLanguage('Common.field.status',language)} code="status" {...commonParams}>
                    <AdSelect payload={{ code: allDictList.Buy_Ledger_OrderType }} />
                </AntdFormItem>,
            ],
            [
                <AntdFormItem label={transferLanguage('ASN.field.poNo',language)} code="poNo" {...commonParams}>
                    <TextArea rows={1} />
                </AntdFormItem>,
                <AntdFormItem label={transferLanguage('ASN.field.partNo',language)} code="partNo" {...commonParams}>
                    <TextArea rows={1} />
                </AntdFormItem>,

            ],

            ['operatorButtons'],
        ];
        const selectFormPackage = {
            firstFormItem: firstFormItemPackage,
            secondFormItem: secondFormItemPackage,
            otherFormItem: otherFormItemPackage,
            form,
            className: this.className,
            handleFormReset: this.handleFormResetPackage,
            handleSearch: this.handleSearchPackage,
            toggleForm: this.toggleForm,
            quickQuery: true
        }
        const fields = [
            { key1: 'planPcsQty', key2: 'actualPcsQty', name: transferLanguage('ASN.field.planOrActPcsQty',language), isContrast: true },
            { key1: 'planInnerQty', key2: 'actualInnerQty', name: transferLanguage('ASN.field.planOrActInnerQty',language), isContrast: true },
            { key1: 'planPalletQty', key2: 'actualPalletQty', name: transferLanguage('ASN.field.planOrActPalletQty',language), isContrast: true },
            { key1: 'planBoxQty', key2: 'actualBoxQty', name: transferLanguage('ASN.field.planOrActBoxQty',language), isContrast: true },
            { key1: 'planGrossWeight', key2: 'actualGrossWeight', name: transferLanguage('ASN.field.planOrActGrossWeight',language), isContrast: true },
            { key1: 'planNetWeight', key2: 'actualNetWeight', name: transferLanguage('ASN.field.planOrActNetWeight',language), isContrast: true },
            { key1: 'planVolume', key2: 'actualVolume', name: transferLanguage('ASN.field.planOrActVolume',language), isContrast: true },
            { key1: 'planCargoValue', key2: 'actualCargoValue', name: transferLanguage('ASN.field.planOrActCargoValue',language), isContrast: true },
        ]
        const generateButton = (
            <Button.Group>
                {
                    currentId ?
                        <>
                            <AdButton text={transferLanguage('ASN.field.asnConfirm',language)} onClick={() => this.ableOperate('confirm')} />
                            <AdButton text={transferLanguage('ASN.field.cancelConfirm',language)} onClick={() => this.ableOperate('cancel')} />
                            <AdButton text={transferLanguage('ASN.field.cancelAsn',language)} onClick={() => this.ableOperate('cancelASN')} />
                            <AdButton text={transferLanguage('ASN.field.receiveConfirm',language)} onClick={() => this.ableOperate('receiveItem')} />
                            <AdButton text={transferLanguage('ASN.field.cancelReceive',language)} onClick={() => this.ableOperate('cancelReceive')} />
                            <AdButton text={transferLanguage('ASN.field.createPutaway',language)} onClick={() => this.ableOperate('putaway')} />
                            <AdButton text={transferLanguage('ASN.field.cancelPutaway',language)} onClick={() => this.ableOperate('cancelPutaway')} />
                        </> : ''
                }
                {
                    disabled ? <AdButton text={transferLanguage('Common.field.edit',language)} onClick={() => this.setState({ disabled: false })} />
                        :
                        (
                            <>
                                <AdButton type='primary' text={transferLanguage('Common.field.save',language)} onClick={() => this.saveInfo()} />
                                <AdButton text={transferLanguage('Common.field.cancel',language)} onClick={() => this.setState({ disabled: true })} />
                            </>
                        )
                }
            </Button.Group>
        )
        const genExtraBasicInfo = () => {
            return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{transferLanguage('Common.field.details',language)}</span>
                {generateButton}
            </div>
        }
        const tableButtonsBill = {
            buttons: (
                <Button.Group>
                    <AdButton text={transferLanguage('Common.field.edit',language)} onClick={() => this.ableOperate('billEdit')} />
                    <AdButton text={transferLanguage('Common.field.delete',language)} onClick={() => this.ableOperate('billDelete')} />
                    <AdButton text={transferLanguage('ASN.field.recount',language)} onClick={() => this.ableOperate('billReCharge')} />
                </Button.Group>
            ),
            rightButtons: (
                <Button.Group>
                    <AdButton type='primary' text={transferLanguage('Common.field.add',language)} onClick={() => this.ableOperate('billAdd')} />

                </Button.Group>
            ),
        }
        const operations = (
            <div style={{ display: 'flex' }}>
                {/* <AdButton type="primary" text='保存表格'  onClick={this.saveForms}/> */}
            </div>
        )
        const panelValue = [
            { title: transferLanguage('Common.field.basicInformation',language) },
            { title: transferLanguage('ASN.field.partsInformation',language) },
            { title: transferLanguage('ASN.field.detailInformation',language) },
        ]
        const firstTabs = [
            { title: transferLanguage('ASN.field.base',language) },
            { title: transferLanguage('ASN.field.transport',language) },
            { title: transferLanguage('ASN.field.customs',language)},
            { title: transferLanguage('ASN.field.expand',language) },
            { title: transferLanguage('ASN.field.bill',language) },
        ]
        const customPanelStyle = {
            borderRadius: 4,
            marginBottom: 12,
            border: 0,
            overflow: 'hidden',
        };
        return (
            <div className={styles.CollapseUpdate}>
                <PageHeaderWrapper title={genExtraBasicInfo()} >
                    <Collapse activeKey={this.state.activeKey} bordered={false} onChange={key => this.callback(key)}>
                        <Panel header={panelValue[0].title} key='1' style={customPanelStyle} >
                            <div className={styles.tableListForm}>
                                <Tabs defaultActiveKey='1' tabBarExtraContent={operations} onChange={this.tabsChange} tabBarStyle={{ marginBottom: '10px' }}>
                                    <TabPane tab={firstTabs[0].title} key='1'>
                                        <BaseInfoForm selectDetails={selectDetails} disabled={disabled} onRef={(ref) => this.onRef(ref, formType[0])} saveForms={this.saveForms} />
                                    </TabPane>
                                    <TabPane tab={firstTabs[1].title} key='2'>
                                        <TrainingForm selectDetails={selectDetails} disabled={disabled} onRef={(ref) => this.onRef(ref, formType[1])} saveForms={this.saveForms} />
                                    </TabPane>
                                    <TabPane tab={firstTabs[2].title} key='3'>
                                        <CustomsForm selectDetails={selectDetails} disabled={disabled} onRef={(ref) => this.onRef(ref, formType[2])} saveForms={this.saveForms} />
                                    </TabPane>
                                    {/* <TabPane tab={firstTabs[3].title} key='4'>
                                        <ExtraForm selectDetails={selectDetails} disabled={disabled} onRef={this.onRef.bind(this)} />
                                    </TabPane> */}
                                    <TabPane tab={firstTabs[4].title} key='4'>
                                        <Fragment>
                                            <TableButtons {...tableButtonsBill} />
                                            <StandardTable
                                                selectedRows={selectedRowsBill}
                                                onSelectRow={(rows) => this.handleSelectRows(rows, 'bill')}
                                                data={billList}
                                                columns={this.state._columnsParts}
                                                onPaginationChange={(params) => this.handleStandardTableChange(params, 'bill')}
                                                expandForm={expandForm}
                                                className={this.className}
                                            />
                                        </Fragment>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Panel>
                        {
                            currentId ?
                                <Panel header={panelValue[1].title} key='2' style={customPanelStyle} extra={this.extraCur('second')}>
                                    <DetailsList isThree detilsData={{ fields: fields, value: selectDetails }} />
                                </Panel> : ''
                        }
                        {
                            currentId ? <Panel header={panelValue[2].title} key='3' style={customPanelStyle} extra={this.extraCur('third')}>
                                <Tabs defaultActiveKey="1" onChange={this.tabsChange2} tabBarStyle={{ marginBottom: '10px' }}>
                                    <TabPane tab={transferLanguage('ASN.field.parts',language)} key="1"  >
                                        <Fragment>
                                            <SelectForm {...selectFormParts} />
                                            <StandardTable
                                                selectedRows={selectedRowsParts}
                                                onSelectRow={(rows) => this.handleSelectRows(rows, 'parts')}
                                                data={partsList}
                                                columns={this.columnsParts}
                                                onPaginationChange={(params) => this.handleStandardTableChange(params, 'parts')}
                                                // expandForm={expandForm}
                                                className={this.className}
                                            // disabledRowSelected={true}
                                            />
                                        </Fragment>
                                    </TabPane>
                                    <TabPane tab={transferLanguage('ASN.field.package',language)} key="2" >
                                        <SelectForm {...selectFormPackage} />
                                        <StandardTable
                                            data={packageList}
                                            columns={this.state._columnsPackage}
                                            onPaginationChange={(params) => this.handleStandardTableChange(params, 'package')}
                                            // expandForm={expandForm}
                                            className={this.className}
                                            disabledRowSelected={true}
                                        />
                                    </TabPane>

                                </Tabs>
                            </Panel> : ''}
                    </Collapse>
                </PageHeaderWrapper>
                {visibleParts && <AdModal
                    visible={visibleParts}
                    title={this.state.partdetail && this.state.partdetail.id ? 
                        transferLanguage('Common.field.editDetail',language) : transferLanguage('Common.field.addDetail',language)}
                    onOk={() => {
                        if(disabled) return
                        this.addPartDetail()
                    }}
                    onCancel={() => this.setState({ visibleParts: false })}
                    width='800px'
                >
                    <AddPartsForm selectDetails={this.state.partdetail} disabled={disabled} onRef={(ref) => this.onRef(ref, 'PartDetail')} saveForms={this.saveDetailForm} />
                </AdModal>}
            </div>
        )
    }
}