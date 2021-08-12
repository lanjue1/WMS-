import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { transferLanguage } from '@/utils/utils';

import {
    allDispatchType,
    codes,
    selectList,
    routeUrl,
    columns,
} from './utils';
// import { languages } from 'monaco-editor';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ blockQueue, loading, component, i18n }) => ({
    blockQueue,
    blockQueueList: blockQueue.blockQueueList,
    dictObject: component.dictObject,
    language: i18n.language,
    loading: loading.effects[allDispatchType.list],

}))
@Form.create()
export default class blockQueueList extends Component {
    className = 'blockQueueList';
    constructor(props) {
        super(props);
        this.state = {
            formValues: {},
            detailId: '',
            visible: false,
            expandForm: false,
            selectedRows: [],
            _columns: [],

        };
    }
    componentDidMount() {
        selectList({ props: this.props });
        this.changeTitle(columns, '_columns')
    }
    //国际化，修改culumns中的title
    changeTitle = (param, params) => {
        let _columnsAllotOne = []
        _columnsAllotOne = param.map(v => {
            v.title = transferLanguage(v.title, this.props.language)
            return v
        })
        this.setState({
            [params]: _columnsAllotOne
        })
    }

    /**
     * form 查找条件 重置
     */
    handleFormReset = () => {
        const { form, } = this.props
        const props = { props: this.props };
        this.setState({
            formValues: {},
        });
        form.resetFields();
        // saveAllValues({ payload: { formValues: {} }, ...props });
        selectList({ ...props });
    };

    /**
     * form 查找条件 查询
     */
    handleSearch = formValues => {
        // if (!formValues) return;
        const params = { props: this.props, payload: formValues };
        selectList(params);
        this.setState({ formValues })
    };

    /**
     * table 表格 分页操作
     */
    handleStandardTableChange = param => {
        const { formValues } = this.state;
        selectList({ payload: { ...formValues, ...param }, props: this.props });
    };

    // 选中行
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

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

    //新建
    handleAdd = () => {
        router.push(routeUrl.add)
    }
    //编辑
    handleEdit = () => {
        const { detailId } = this.state;
        this.handleSelectRows([{ visible: false }]);
        router.push(`${routeUrl.edit}/${detailId}`)
    };


    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };


    render() {
        const { blockQueueList, loading, form, language } = this.props;
        const {
            expandForm,
            selectedRows,
            _columns,
        } = this.state;
        const commonParams = {
            getFieldDecorator: form.getFieldDecorator,
        };
        const firstFormItem = (
            <AntdFormItem label={transferLanguage('BlockQueue.field.referenceCode', language)} code="referenceCode" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const secondFormItem = (
            <AntdFormItem label={transferLanguage('BlockQueue.field.soId', language)} code="soId" {...commonParams}>
                <Input />
            </AntdFormItem>
        );
        const otherFormItem = [
            [
                <AntdFormItem label={transferLanguage('BlockQueue.field.part', language)} code="partId" {...commonParams}>
                    <Input />
                </AntdFormItem>,
            ], 
            // [
            //     <AntdFormItem label={transferLanguage('BlockQueue.field.type', language)} code="type" {...commonParams}>
            //         <Input />
            //     </AntdFormItem>,
            //     // <AntdFormItem label={transferLanguage('Load.field.trackingNo', language)} code="trackingNo" {...commonParams}>
            //     //     <Input />
            //     // </AntdFormItem>,
            // ],
            ['operatorButtons'],
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

            // code: codes.select,
        };

        const tableButtonsParams = {
            // handleAdd: this.handleAdd,
            // code: codes.addEndorse,

            // rightButtonsFist: (
            //     <AdButton
            //         type="primary"
            //         style={{ marginLeft: 8 }}
            //         onClick={() => this.add()}
            //         text="新增"
            //         // code={codes.addEndorse}
            //     />

            // ),
            // buttons: (
            //     <Button.Group>
            //         <AdButton 
            //         onClick={() => this.abledStatus()}
            //         disabled={selectedRows.length > 0 ? false : true}
            //         text={transferLanguage('Load.button.deliveryRegister', this.props.language)}  />
            //         <AdButton 
            //         onClick={() => this.abledStatus('confim')}
            //         disabled={selectedRows.length > 0 ? false : true}
            //         text={transferLanguage('Load.button.deliveryConfirm', this.props.language)}  />
            //     </Button.Group> 

            // ),
            selectedRows: selectedRows,
        };
        // console.log('blockQueueList--',blockQueueList)
        // 详情 参数
        return (
            <Fragment>
                <SelectForm {...selectFormParams} />
                <TableButtons {...tableButtonsParams} />
                <StandardTable
                    // disabledRowSelected={true}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    loading={loading}
                    data={blockQueueList}
                    columns={_columns}
                    onPaginationChange={this.handleStandardTableChange}
                    expandForm={undefined}
                    className={this.className}
                // code={codes.page}
                // disabledSelectedRows={{ code: ['status'], value: ['CONFIRM'] }}
                // getCheckboxProps={record => {
                //     const status = record.status;
                //     const checked = status === 'CONFIRM';
                //     return !checked;
                // }}
                />
            </Fragment>
        );
    }
}
