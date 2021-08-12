import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
// import { routerRedux, Route, Switch } from 'dva/router';
import { Form, Input, Select, Button, Badge, Row, Col } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import AdSelect from '@/components/AdSelect';
import { codes, STATUS, EventType, NoticeMode, statusMap, SelectColumns } from './utils';
import { formateDateToMin,allDictList } from '@/utils/common';
import RightDraw from '@/components/RightDraw';
import ContentDetails from './ContentDetails';
import { transferLanguage, columnConfiguration } from '@/utils/utils'
import { columns } from './utils'
// import { languages } from 'monaco-editor';
import ButtonGroup from 'antd/lib/button/button-group';
import { editCol, editRow } from '@/utils/constans';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import SearchSelect from '@/components/SearchSelect';
import AdModal from '@/components/AdModal';
import Prompt from '@/components/Prompt';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ interfaceContent, common, loading, i18n }) => ({
    interfaceContent,
    loading: loading.effects['interfaceContent/interfaceContentList'],
    dictObject: common.dictObject,
    language: i18n.language,

}))
@Form.create()
export default class InterfaceContentList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        visible: false,
        visibleMod: false,
        checkIds: [],
        isAbled: true,
        formValues: {},
        _columns: [],
        _STATUS: [],
        _businessTypeCode: [],
        _SelectColumns: [],
        visibleIgnore:false,
    };
    className = 'interfaceContent';
    columns = [
        {
            title: '#',
            dataIndex: 'index',
            render: (text, record, index) => <span>{index + 1}</span>,
            width: 50,
        },
        {
            title: transferLanguage('Content.field.businessTypeCode', this.props.language),
            dataIndex: 'businessTypeCode',
            render: (text, record) => <a onClick={e => this.showDetail(e, record)} title={text}>
                {text}
            </a>,
            width: 200,
        },
        {
            title: transferLanguage('Content.field.businessCode', this.props.language),
            dataIndex: 'businessCode',
            width: 200,
        },

        {
            title: transferLanguage('Content.field.businessType', this.props.language),
            dataIndex: 'businessType',
            render: text => <span title={text}>{text}</span>,
            width: 200,
        },
        {
            title: transferLanguage('Content.field.idOrder', this.props.language),
            dataIndex: 'id',
            width: 180,
        },
        {
            title: transferLanguage('TrackOrderList.field.orderNo', this.props.language),
            dataIndex: 'businessId',
            width: 180,
        },
        {
            title: transferLanguage('Content.field.senderSys', this.props.language),
            dataIndex: 'senderSys',
            render: text => <span title={text}>{text}</span>,
        },
        {
            title: transferLanguage('Content.field.receiverSys', this.props.language),
            dataIndex: 'receiverSys',
            render: text => <span title={text}>{text}</span>,
        },
        {
            title: transferLanguage('Content.field.dealStatus', this.props.language),
            dataIndex: 'dealStatus',
            render: (text) => {
                const val = <AdSelect data={STATUS} value={text} onlyRead={true} />;
                return <Badge status={statusMap[text]} text={val} />
            },
            width: 100,
        },
        {
            title: transferLanguage('Content.field.requestData', this.props.language),
            dataIndex: 'requestData',
            render: text => <span title={text}>{text}</span>,
        },
        {
            title: transferLanguage('Content.field.responseData', this.props.language),
            dataIndex: 'responseData',
            render: text => <span title={text}>{text}</span>,
        },
        {
            title: transferLanguage('Content.field.retryCount', this.props.language),
            dataIndex: 'retryCount',
            render: text => <span title={text}>{text}</span>,
        },
        {
            title: transferLanguage('Content.field.execTime', this.props.language),
            dataIndex: 'execTime',
            render: text => <span title={text}>{text}</span>,
        },
        {
            title: transferLanguage('Content.field.createBy', this.props.language),
            dataIndex: 'createBy',
            render: text => <AdSelect data={NoticeMode} value={text} onlyRead={true} />,
        },
        {
            title: transferLanguage('Content.field.createTime', this.props.language),
            dataIndex: 'createTime',
            render: text => <span title={text}>{text}</span>,
        },

        {
            title: transferLanguage('Content.field.updateBy', this.props.language),
            dataIndex: 'updateBy',
            render: text => <span title={text}>{text}</span>,
        },
        {
            title: transferLanguage('Content.field.updateTime', this.props.language),
            dataIndex: 'updateTime',
            render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : ''}</span>,
        },
    ];

    componentDidMount() {
        this.getContentList();
        this.setState({
            _STATUS: columnConfiguration(STATUS, this.props.language),
            _SelectColumns: columnConfiguration(SelectColumns, this.props.language)
        })

    }

    //详情：
    showDetail = (e, record) => {
        e.stopPropagation();
        const { dispatch } = this.props;
        const { id } = record;
        // console.log('senderId', record.senderId);
        dispatch({
            type: 'interfaceContent/interfaceContentDetails',
            payload: { id },
            callback: res => {
                this.setState({
                    isAbled: ['fail', 'FAIL', 'NOTlOAD', 'LOADFAIL'].indexOf(record.dealStatus) === -1 ? true : false,
                });
            },
        });
        this.setState(
            {
                checkId: id,
                rowDetails: record,
            },
            () => {
                this.setState({
                    visible: true,
                });
            }
        );
    };

    getContentList = (params = {}) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'interfaceContent/interfaceContentList',
            payload: params,
        });
    };

    handleEdit = () => {
        router.push(`/SystemSetting/Task/ContentEdit/${this.state.checkId}`);
        this.closeDetail();
    };
    //重置
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        this.getContentList();
    };
    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
        if (type == 'businessTypeCode') {
            const { form: { setFieldsValue } } = this.props
            setFieldsValue({
                businessType: values[0]?.businessTypeName
            })
        }
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
        // if (!values) {
        //   return;
        // }
        const { ...value } = values;
        this.setState({
            formValues: value,
        });
        this.getContentList(value);
    };
    // 分页操作：改参数
    handleStandardTableChange = param => {
        const { formValues } = this.state;
        const params = {
            ...formValues,
            ...param,
        };
        this.getContentList(params);
    };

    //立即执行：
    retry = (single) => {
        const { dispatch } = this.props;
        const { checkIds, formValues, checkId, } = this.state;
        let params = {};
        if (single === 1) {
            params.ids = [checkId]
        } else {
            params.ids = checkIds;
        }
        dispatch({
            type: 'interfaceContent/retryInterfaceContent',
            payload: params,
            callback: res => {
                this.getContentList(formValues);
                this.setState({selectedRows:[]})
                if (single) {
                    dispatch({
                        type: 'interfaceType/interfaceContentDetails',
                        payload: { id: checkId },
                    });
                }
            },
        });
    };

    closeDetail = () => {
        this.setState({
            visible: false
        })
    }
    handleOk = () => {
        const { form: { getFieldValue }, dispatch } = this.props
        const { formValues, _businessTypeCode } = this.state
        let typeCode = _businessTypeCode
        let requestData = getFieldValue('requestData') || ''
        let businessId = getFieldValue('businessId') || ''
        let params = {
            businessTypeCode: typeCode && typeCode[0] ? typeCode[0].businessTypeCode : '',
            requestData,
            businessId,
            type: 'addTask',
        }
        dispatch({
            type: 'interfaceContent/abledOperate',
            payload: params,
            callback: data => {
                this.getContentList(formValues);
                this.setState((prevState) => ({
                    visibleMod: !prevState.visibleMod,
                    businessTypeCode: []
                }))
            }
        })

    }
    handleOkIgnore=()=>{
        const {dispatch,form:{getFieldValue}}=this.props
        const {checkIds}=this.state
        const _remarks=getFieldValue('_remarks')
        // console.log('_remarks===',_remarks)
        if(!_remarks){
            Prompt({content:'Please Input Remarks',type:'warn'})
            return
        }
        dispatch({
            type:'interfaceContent/abledOperate',
            payload:{ids:checkIds,remarks:_remarks,type:'ignore'},
            callback:()=>{
                this.setState({
                    visibleIgnore:false,
                    selectedRows:[],
                    checkIds:[]
                })
                this.getContentList();
                

            }
        })
    }
    render() {
        const {
            loading,
            interfaceContent: { interfaceContentList },
            form,
            isMobile,
            dictObject,
            language
        } = this.props;
        const {
            selectedRows,
            expandForm,
            visible,
            visibleMod,
            visibleIgnore,
            isAbled,
            checkId,
            _columns,
            _STATUS,
            _businessTypeCode,
            _SelectColumns
        } = this.state;

        const { getFieldDecorator } = form;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <FormItem label={transferLanguage('Content.field.businessTypeCode', language)}>
                {getFieldDecorator('businessTypeCode')(<Input placeholder="" />)}
            </FormItem>
        );
        const secondFormItem = (
            <FormItem label={transferLanguage('Content.field.businessCode', language)}>
                {getFieldDecorator('businessCode')(<Input placeholder="" />)}
            </FormItem>
        );

        // secondForm 参数
        const otherFormItem = [
            [
                <FormItem label={transferLanguage('Content.field.receiverSys', language)}>
                    {getFieldDecorator('receiverSys')(<Input placeholder="" />)}
                </FormItem>,
            ],
            [<FormItem label={transferLanguage('Content.field.senderSys', language)}>
                {getFieldDecorator('senderSys')(<Input placeholder="" />)}
            </FormItem>,
            <FormItem label={transferLanguage('Content.field.dealStatus', language)}>
                {getFieldDecorator('dealStatus')(<AdSelect payload={{ code: allDictList.Task_Status }} />)}
                
            </FormItem>,
            <FormItem label={transferLanguage('Content.field.businessType', language)}>
                {getFieldDecorator('businessType')(<Input placeholder="" />)}
            </FormItem>,
            ],
            [
                <FormItem label={transferLanguage('TrackOrderList.field.orderNo', language)}>
                    {getFieldDecorator('businessId')(<Input placeholder="" />)}
                </FormItem>,
            ],
            ['operatorButtons']
        ];

        const rightDrawParams = {
            isMobile,
            visible,
            title: transferLanguage('Content.field.interfaceContentDetail', language),
            closeDetail: this.closeDetail,
            buttons: (
                <span>
                    {/* {!isAbled && */}
                    <Button.Group>
                        {/* <Button onClick={() => this.retry(1)}>{transferLanguage('Content.field.immediate',language)}</Button> */}
                        <Button type="primary" onClick={this.handleEdit}>{transferLanguage('CargoOwnerDetail.button.edit', language)}</Button>
                    </Button.Group>
                    {/* } */}
                </span >
            ),
        };

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
                <ButtonGroup>
                    <Button onClick={this.retry} disabled={selectedRows.length > 0 ? false : true}>
                        {transferLanguage('Content.field.immediate', language)}
                    </Button>
                    <Button
                        onClick={() => this.setState({ visibleIgnore: true })}
                        disabled={selectedRows.length > 0 ? false : true}
                    >
                        {transferLanguage('Content.field.ignore', language)}
                    </Button>
                </ButtonGroup>
            ),
            rightButtons: (
                <Button.Group>
                    <Button onClick={() => this.setState({ visibleMod: true })} >
                        {transferLanguage('Content.field.addTask', language)}
                    </Button>
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
                    data={interfaceContentList}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={expandForm}
                    className={this.className}
                    code={codes.page}
                    getCheckboxProps={record => {
                        return ['fail', 'FAIL', 'NOTlOAD', 'LOADFAIL', 'OPEN'].indexOf(record.dealStatus) === -1;
                    }}
                />
                <RightDraw {...rightDrawParams}>
                    <ContentDetails checkId={checkId} isMobile={isMobile} />
                </RightDraw>
                {visibleIgnore && <AdModal
                    visible={visibleIgnore}
                    title={transferLanguage('Content.field.ignore', language)}
                    onOk={this.handleOkIgnore}
                    onCancel={() => this.setState({ visibleIgnore: false })}
                    width="600px"
                >
                    <AntdFormItem 
                     width={400}
                    label={transferLanguage('OrgList.field.remarks',language)}
                            code='_remarks'
                            {...commonParams}
                        >
                            <TextArea rows={8}/>
                        </AntdFormItem>
                </AdModal>}
                {visibleMod && <AdModal
                    visible={visibleMod}
                    title={transferLanguage('Content.field.addTask', language)}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ visibleMod: false, businessTypeCode: [] })}
                    width="1000px"
                    style={{ height: '1000px' }}
                >
                    <AntdForm>
                        <Row {...editRow}>
                            <Col {...editCol}>
                                <AntdFormItem label={transferLanguage('Content.field.businessCode', language)}
                                    code='_businessTypeCode'
                                    rules={[{ required: true }]}
                                    {...commonParams}
                                >
                                    <SearchSelect
                                        dataUrl={'mds-interface-type/selectMdsInterfaceTypeList'}
                                        selectedData={_businessTypeCode} // 选中值
                                        showValue="businessTypeCode"
                                        searchName="keyWord"
                                        multiple={false}
                                        columns={_SelectColumns}
                                        onChange={values => this.getValue(values, '_businessTypeCode')}
                                        id="_businessTypeCode"
                                        allowClear={true}
                                        scrollX={200}
                                    />
                                </AntdFormItem>
                            </Col>
                            <Col {...editCol}>
                                <AntdFormItem label={transferLanguage('Content.field.businessType', language)}
                                    code='businessType'
                                    {...commonParams}
                                >
                                    <Input disabled={true} />
                                </AntdFormItem>
                            </Col>
                        </Row>
                        <Row {...editRow}>
                            <Col {...editCol}>
                                <AntdFormItem label={transferLanguage('Content.field.businessId', language)}
                                    code='businessId'
                                    rules={[{ required: true }]}
                                    {...commonParams}
                                >
                                    <Input />
                                </AntdFormItem>
                                <>
                                </>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <AntdFormItem label={transferLanguage('Content.field.requestData', language)}
                                    code='requestData'
                                    rules={[{ required: true }]}
                                    {...commonParams}
                                >
                                    <TextArea rows={12} />
                                </AntdFormItem>
                            </Col>
                        </Row>
                    </AntdForm>
                </AdModal>}
            </Fragment >
        );
    }
}
