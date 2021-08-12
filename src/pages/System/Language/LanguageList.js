import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment, { lang } from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Button, Icon } from 'antd';
import StandardTable from '@/components/StandardTable';;
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, Status, formatStatus } from './utils';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton'
import { transferLanguage, columnConfiguration } from "@/utils/utils";
// import { languages } from 'monaco-editor';
import { allDictList } from '@/utils/common'
import AdModal from '@/components/AdModal';
import { formItemFragement } from '@/utils/common';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import FileImport from '@/components/FileImport'
import Prompt from '@/components/Prompt';
import { editRow, editCol, listCol } from '@/utils/constans';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ Language, common, component, loading, i18n }) => ({
    Language,
    loading: loading.effects['Language/countryList'],
    dictObject: common.dictObject,
    searchValue: component.searchValue,
    language: i18n.language
}))
@Form.create()
export default class LanguageList extends Component {
    state = {
        expandForm: false,
        selectedRows: [],
        checkId: '',
        checkIds: [],
        formValues: {},
        isAbled: '',
        _Status: [],
        paramArr: [],
        addArr: [],
        selectedRowsAddData: {},
        isAdd: false,
        visible: false,
        visibleImport: false,
        closeCircle: '',
    };
    className = 'language';
    commonParams = {
        getFieldDecorator: this.props.form.getFieldDecorator
    };
    //列表 列
    columns = [{
        title: '#',
        dataIndex: 'index',
        render: (text, record, index) => (<span>{index + 1}</span>),
        width: 50
    },
    {
        title: transferLanguage('CountryList.field.keyword', this.props.language),
        dataIndex: 'keyword',
        width: 100,
    },
    {
        title: transferLanguage('CountryList.field.code', this.props.language),
        dataIndex: 'code',
        width: 150,
    },
    {
        title: transferLanguage('CountryList.field.Name', this.props.language),
        dataIndex: 'name',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('ContactUnit.field.country', this.props.language),
        dataIndex: 'country',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('Common.field.type', this.props.language),
        dataIndex: 'type',
        render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
        title: transferLanguage('Common.field.status', this.props.language),
        dataIndex: 'beActive',
        render: text => <span>{text?'启用':'禁用'}</span>,
    },
    {
        title: transferLanguage('CountryList.field.remarks', this.props.language),
        dataIndex: 'remarks',
        render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
        width: 100,
    },
    {
        title: transferLanguage('CountryList.field.createBy', this.props.language),
        dataIndex: 'createBy',
        render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
        width: 100,
    },
    ];
    selectedRowsColumns = [
        {
            title: transferLanguage('CountryList.field.keyword', this.props.language),
            dataIndex: 'keyword',
            width: 100,
            render: (text, record) => <AntdFormItem
                initialValue={text}
                label=""
                code={`keyword-${record.id}`} {...this.commonParams}
            >
                <AntdInput onChange={value => this.handleFieldChange(value, 'keyword', record.id)}/>
            </AntdFormItem>
        },
        {
            title: transferLanguage('CountryList.field.code', this.props.language),
            dataIndex: 'code',
            width: 150,
            render: (text, record) => {
                return <AntdFormItem initialValue={text}
                    label=""
                    code={`code-${record.id}`} {...this.commonParams}>
                    {/* <AntdInput /> */}
                    <AntdInput onChange={value => this.handleFieldChange(value, 'code', record.id)} />
                </AntdFormItem>
            }
        },
        {
            title: transferLanguage('CountryList.field.Name', this.props.language),
            dataIndex: 'name',
            width: 100,
            render: (text, record) => {
                return <AntdFormItem initialValue={text}
                    label=""
                    code={`name-${record.id}`} {...this.commonParams}>
                    <AntdInput onChange={value => this.handleFieldChange(value, 'name', record.id)} />

                </AntdFormItem>
            }
        },
        {
            title: transferLanguage('ContactUnit.field.country', this.props.language),
            width: 100,
            dataIndex: 'country',
            render: (text, record) => {
                return <AntdFormItem initialValue={text}
                    label=""
                    code={`country-${record.id}`} {...this.commonParams}>
                    <AdSelect
                        payload={{ code: allDictList.COUNTRY }}
                        onChange={value => this.handleFieldChange(value, 'country', record.id)}
                    />

                </AntdFormItem>
            }
        },
        {
            title: transferLanguage('Common.field.type', this.props.language),
            width: 180,
            dataIndex: 'type',
            render: (text, record) => {
                return <div style={{ position: 'relative', width: '180px' }}>
                    <AntdFormItem initialValue={text}
                        label=""
                        code={`type-${record.id}`} {...this.commonParams}>
                        <AdSelect
                            payload={{ code: allDictList.MESSAGE_SOURCE_TYPE }}
                            onChange={value => this.handleFieldChange(value, 'type', record.id)}
                        />
                    </AntdFormItem>
                    <div style={{ position: 'absolute', right: '-20px', top: '6px' }}>
                        <Icon type="close-circle" onClick={() => this.closeItem(record.id, record)} />
                    </div>
                </div>
            }
        },
    ]
    componentDidMount() {
        this.getCountryList();

        this.setState({
            _Status: columnConfiguration(Status, this.props.language)
        })
    }
    addDefaultInfo = () => {
        const obj = {
            id: `MM${Math.ceil(Math.random() * 10000) + 10000}`,
            code: '',
            name: '',
            country: '',
            type: '',
        }
        return obj
    }
    closeItem = (id, record) => {
        const { addArr } = this.state
        if (addArr.length == 1 && (!record.code)) {
            Prompt({ content: '您无需删除未填code的第一项' })
            return;
        }
        const deleteItemIndex = addArr.findIndex(v => v.id === id)
        let newAddArr = [...addArr]
        newAddArr.splice(deleteItemIndex, 1)
        this.setState({
            selectedRowsAddData: { list: newAddArr },
            addArr: newAddArr
        })
    }
    // 增加一条-02
    nextAdd = () => {
        const { addArr } = this.state
        if (addArr.length > 0 && (!addArr[addArr.length - 1].code || !addArr[addArr.length - 1].name)) {
            Prompt({ content: '请填写code或name', type: 'warn' })
            return
        }
        this.addPreInfo()
    }
    getCountryList = (params = {}) => {
        const { dispatch, searchValue } = this.props;
        dispatch({
            type: 'Language/countryList',
            payload: params,
            callback: data => {
                if (!data) return;
                let valueList = [];
                // data.map(v => {
                //     const labels = ['senderId'];
                //     labels.map(item => {
                //         if (v[item] && !valueList.includes(v[item])) {
                //             valueList.push(v[item]);
                //             !searchValue[v[item]] &&
                //                 dispatch({
                //                     type: 'component/querySearchValue',
                //                     payload: {
                //                         params: { id: v[item] },
                //                         url: 'sms/sms-sender/viewSmsSenderDetails',
                //                     },
                //                 });
                //         }
                //     });
                // });
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



    //启用、禁用：
    abledStatus = (type) => {
        const { dispatch } = this.props;
        const { checkIds, checkId, formValues } = this.state;
        let params = {
            type,
            ids: checkIds
        };
        dispatch({
            type: 'Language/ableOperate',
            payload: params,
            callback: res => {
                this.getCountryList(formValues);
            },
        });
    };
    // 增加一条-01
    addPreInfo = () => {
        const { addArr } = this.state
        const _newData = [...addArr, this.addDefaultInfo()]
        this.setState({
            addArr: _newData,
            selectedRowsAddData: {
                list: _newData,
            }
        })
    }
    handleFieldChange = (value, fieldName, id) => {
        const { paramArr, isAdd, addArr } = this.state
        let newDataList = [...paramArr]
        let newAddArr = [...addArr]
        if (isAdd) {
            let target = newAddArr.filter(item => item.id === id)[0]
            if (target) {
                target[fieldName] = value
            } else {
                target = this.addDefaultInfo()
            }
            const coverIndex = newAddArr.findIndex(v => v.id === id)
            if (coverIndex === -1) {
                newAddArr.push(target)
            } else {
                newAddArr[coverIndex] = target
            }
            this.setState({
                addArr: newAddArr,
                selectedRowsAddData: { list: newAddArr }
            })
        } else {
            const target = newDataList.filter(item => item.id === id)[0]
            if (target) target[fieldName] = value
            const coverIndex = newDataList.findIndex(v => v.id === id)
            newDataList[coverIndex] = target
            this.setState({ paramArr: newDataList })
        }


    }


    handleOk = () => {
        const { form, dispatch } = this.props
        const { selectedRows, paramArr, addArr, isAdd, formValues } = this.state
        const params = {
            type: isAdd ? 'addLang' : 'editLang',
        }
        isAdd ? params.addLangArr = addArr : params.editLangArr = paramArr
        dispatch({
            type: 'Language/ableOperate',
            payload: params,
            callback: (res) => {
                this.setState({ visible: false, paramArr: [] })
                isAdd && this.setState({
                    isAdd: false,
                    addArr: [],
                })
                this.getCountryList(formValues);
            }
        })
    }

    render() {
        const {
            loading,
            Language: { countryList, countryDetails },
            form,
            isMobile,
            dictObject,
            language,
        } = this.props;
        const { getFieldDecorator, getFieldValue } = form;
        const {
            selectedRows,
            isAbled,
            checkId,
            visible,
            rowDetails,
            expandForm,
            _Status,
            isAdd,
            addArr,
            selectedRowsAddData,
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const selectedRowsEditData = {
            list: selectedRows,
            pagination: {
                current: 1,
                pageSize: 50,
                total: selectedRows.length,
            },
        }
        const firstFormItem = (
            <FormItem label={transferLanguage('Common.field.code', language)}>
                {getFieldDecorator('code')(<Input placeholder="" />)}
            </FormItem>
        );
        // const secondFormItem = (
        //     <FormItem label={transferLanguage('Common.field.name', language)}>
        //         {getFieldDecorator('name')(<Input placeholder="" />)}
        //     </FormItem>
        // );

        // // secondForm 参数
        // const otherFormItem = [
        //     [
        //         <FormItem label={transferLanguage('Common.field.status', language)}>
        //             {getFieldDecorator('status')(
        //                <Input />
        //             )}
        //         </FormItem>
        //     ], ['operatorButtons']
        // ];
        const selectFormParams = {
            firstFormItem,
            // secondFormItem,
            // otherFormItem,
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
            code: codes.add,
            rightButtons: (
                <Button.Group>
                    <AdButton
                        type='primary'
                        onClick={() => this.setState({ visible: true, paramArr: selectedRows })}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('Common.field.edit', this.props.language)}
                    />
                    <AdButton
                        type='primary'
                        onClick={() => {
                            this.setState({ visible: true, isAdd: true })
                            this.addPreInfo()
                        }}
                        text={transferLanguage('Common.field.add', this.props.language)}
                    />
                </Button.Group>
            ),
            buttons: (
                <Button.Group>
                    <AdButton
                        onClick={() => this.abledStatus('disable')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('CountryList.button.disable', this.props.language)}
                        codes={codes.disabled}
                    />
                    <AdButton
                        onClick={() => this.abledStatus('enable')}
                        disabled={selectedRows.length > 0 ? false : true}
                        text={transferLanguage('CountryList.button.enable', this.props.language)}
                        code={codes.enable}
                    />
                    <AdButton
                        onClick={() => this.setState({ visibleImport: true })}
                        text={transferLanguage('Common.field.import', this.props.language)}
                    />
                </Button.Group>
            ),
            selectedRows: selectedRows,
        };

        return (
            <Fragment>
                <FileImport
                    visibleFile={this.state.visibleImport}
                    handleCancel={() => this.setState({ visibleImport: false })}
                    urlImport={`mds-message-source/importMdsMessageSource`}
                    // urlCase={`template/download?fileName=Buyback_Template.xlsx`}
                    queryData={[this.getCountryList]}
                    accept=".xls,.xlsx"
                    importPayload={{ country: getFieldValue('countryImport'), type: getFieldValue('typeImport') }}
                    extra={(
                        <AntdForm>
                            <Row gutter={editCol}>
                                <Col lg={12} md={24}>
                                    <AntdFormItem
                                        label={transferLanguage('ContactUnit.field.country', language)}
                                        width={200}
                                        code={`countryImport`} {...commonParams}>
                                        <AdSelect
                                            payload={{ code: allDictList.COUNTRY }}
                                        />
                                    </AntdFormItem>
                                </Col>
                                <Col lg={12} md={24}>
                                    <AntdFormItem
                                        label={transferLanguage('Common.field.type', language)}
                                        width={200}
                                        code={`typeImport`} {...commonParams}>
                                        <AdSelect
                                            payload={{ code: allDictList.MESSAGE_SOURCE_TYPE }}
                                        />
                                    </AntdFormItem>
                                </Col>
                            </Row>
                        </AntdForm>
                    )}
                />
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
                {visible && <AdModal
                    visible={visible}
                    title={isAdd ? transferLanguage('Language.field.addLanguage') : transferLanguage('Language.field.editLanguage')}
                    // onOk={this.handleOk}
                    onCancel={() => this.setState({ visible: false, isAdd: false, addArr: [] })}
                    width="900px"
                    footer={[
                        <Button key="cancel" onClick={() => this.setState({ visible: false, isAdd: false })}>取消</Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk}>确认</Button>,
                        isAdd && <Button key="add" type="primary" onClick={this.nextAdd}>新增一条</Button>
                    ]}
                >
                    <AntdForm>
                        <StandardTable
                            // selectedRows={selectedRows}
                            scrollX={800}
                            disabledRowSelected={true}
                            loading={loading}
                            data={isAdd ? selectedRowsAddData : selectedRowsEditData}
                            // data={codeData}
                            columns={this.selectedRowsColumns}

                        // onSelectRow={this.handleSelectRows}
                        // onPaginationChange={this.handleStandardTableChange}
                        // expandForm={expandForm}
                        // className={this.className}
                        />
                    </AntdForm>
                </AdModal>}

            </Fragment>
        );
    }
}
