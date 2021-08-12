import React, { Component, Fragment } from 'react';
import { Card, Select, Icon, Button, Form, Modal } from 'antd';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable'
import AdSelect from '@/components/AdSelect'
import { codes } from './utils'

@connect(({ tmsAuth, loading, login }) => ({
    tmsAuth,
    loading: loading.effects['selectWarehouse/fetchAuthWarehouseList'],
    clientList: tmsAuth.clientList,
    user: login.user
}))
@Form.create()
export default class SelectWarehouse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            bindingWarehouseId: ''
        };
    }

    componentDidMount() {
        const { dispatch, id, user } = this.props
        dispatch({
            type: 'tmsAuth/clientList',
            payload: { userId: id },
            callback: (data) => {
                this.setState({
                    selectedRows: data.filter(item => item.isRelation === "true"),
                    bindingWarehouseId: data.filter(item => item.isBinding === "true")[0].id,
                })

            }
        })
    }

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


    onOk = () => {
        const { checkIds } = this.state
        const { form, onCancel, dispatch, user, id } = this.props
        form.validateFieldsAndScroll((err, values) => {

            dispatch({
                type: 'tmsAuth/abledStatus',
                payload: {
                    bindingCustomerId: values.bindingWarehouseId,
                    relationCustomerIds: checkIds,
                    userId: id,
                    type:'relationUser',
                },
                callback: (res) => {
                    onCancel()
                    dispatch({
                        type: 'tmsAuth/clientList',
                        payload: { userId: user.id }
                    })
                    dispatch({
                        type: 'login/checkLogin'
                    })
                }
            })
        })
    }

    columns = [
        {
            title: 'Code',
            dataIndex: 'code',
        },
        {
            title: '用户名称',
            dataIndex: 'name',
        },
    ]
    render() {
        const { visible, loading, clientList, onCancel, form } = this.props
        const { selectedRows, bindingWarehouseId } = this.state
        const { getFieldDecorator } = form;
        return (<div>
            <Modal
                visible={this.props.visible}
                title="关联客户"
                onOk={this.onOk}
                onCancel={onCancel}
                width="60%"
                style={{
                    maxWidth: 600,
                }}
            >
                <Form>
                    <Form.Item label="默认绑定客户">
                        {getFieldDecorator('bindingWarehouseId', {
                            rules: [{ required: true, message: '请输入用户名' }],
                            initialValue: bindingWarehouseId,
                        })(<Select >
                            <Option value="" disabled >请选择</Option>
                            {selectedRows.map(item => (<Option value={item.id} >
                                {item.name}
                            </Option>))}
                        </Select>)}
                    </Form.Item>
                </Form>
                <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    data={clientList}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    code={codes.page}
                />
            </Modal>
        </div>)
    }
}