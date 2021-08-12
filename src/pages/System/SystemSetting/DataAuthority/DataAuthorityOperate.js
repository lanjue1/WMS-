import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Spin, Modal, Button, Input } from 'antd';
import EditPage from '@/components/EditPage';
import AntdForm from '@/components/AntdForm';
import router from 'umi/router';
import AdSearch from '@/components/AdSearch';
import AdSelect from '@/components/AdSelect';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import AdButton from '@/components/AdButton';
import DataFilter from './DataFilter';
import SearchSelect from '@/components/SearchSelect';
import AntdSelectRegion from '@/components/AntdSelectRegion';
import { formItemFragement, queryDict } from '@/utils/common';
import { columnsRole } from '@/pages/Common/common';
import { allDictList } from '@/utils/constans';
import { allDispatchType, dataDetail, routeUrl, codes, selectSequenceList } from './utils';

@connect(({ dataAuthority, component, loading }) => ({
    dataDetail: dataAuthority.dataDetail,
    dataAuthorityList: dataAuthority.dataAuthorityList,
    dictObject: component.dictObject,
    formValues: dataAuthority.formValues,
    loading: loading.effects[allDispatchType.detail],
}))
@Form.create()
export default class SequenceOperate extends Component {
    state = {
        detailId: '',
        type: '',
        visible: false,
        disabled: false,
        roles: [],
        selectedRowsPre: [],
    };

    componentWillMount() {
        // const allDict = [allDictList.dataType];
        // queryDict({ props: this.props, allDict });
    }

    componentDidMount() {
        const {
            match: {
                params: { id },
            },
        } = this.props;
        if (!id) return;
        this.handleStateChange([{ detailId: id }]);
        this.getDetails(id);
    }
    getDetails = id => {
        dataDetail({
            type: allDispatchType.detail,
            payload: { id },
            props: this.props,
            callback: data => {
                this.setState({
                    roles: [{ id: data.roleId }] || [],
                    menu: data.menuId,
                })
            },
        });
    };

    handleStateChange = (options = []) => {
        options.map(item => {
            this.setState(item);
        });
    };

    setTabName = payload => {
        const { dispatch } = this.props;
        dispatch({
            type: 'common/setTabsName',
            payload,
            callback: data => {
                if (!data) return;
                router.push(`${routeUrl.edit}/${payload.id}`);
            },
        });
    };

    /**
     * 保存数据
     */
    saveInfo = () => {
        const {
            form,
            match: {
                params: { id },
            },
            dataAuthorityList,
            dataDetail
        } = this.props;
        const detail = dataDetail[id] || {};
        form.validateFieldsAndScroll((errors, values) => {
            const { roleId, menuId, ...params } = values;
            const { roles } = this.state;
            params.roleId = roles[0].id;

            if (id) {
                params.id = id;
                params.menuId = detail.menuId;
            } else {
                params.menuId = menuId[menuId.length - 1];
            }

            //2、校验明细
            const infoForm = this.child.props.form;
            let relationVOS = [];

            infoForm.validateFieldsAndScroll(err => {
                if (err || errors) return;
                if (id) {
                    relationVOS = dataAuthorityList[id].list.map(item => {
                        const { ...restd } = item;
                        if (item.id.includes('isNew')) {
                            const { id, ...rest } = restd;
                            return rest;
                        }
                        return restd;
                    });
                } else {
                    relationVOS =
                        Object.keys(dataAuthorityList).length > 0
                            ? dataAuthorityList[''].list.map(item => {
                                const { id, ...rest } = item;
                                return rest;
                            })
                            : [];
                }
                params.dataFilterList = relationVOS;
                // return; //测试
                this.operateDispatch(params);
            });
        });
    };

    operateDispatch = params => {
        const { dispatch } = this.props;
        dispatch({
            type: allDispatchType.save,
            payload: params,
            callback: data => {
                this.setState(preState => ({
                    disabled: !preState.disabled,
                }));
                if (params.id) {
                    this.getDetails(params.id);
                } else {
                    this.setTabName({
                        id: data,
                        isReplaceTab: true,
                    });
                }
                selectSequenceList({ props: this.props });
            },
        });
    };
    getValue = values => {
        this.setState({
            roles: values,
        });
    };
    headerOperate = () => {
        const { disabled, detailId } = this.state;
        return disabled ? (
            <AdButton
                type="primary"
                onClick={() => {
                    this.setState(preState => ({
                        disabled: !preState.disabled,
                    }));
                }}
                text="编辑"
            />
        ) : (
                <Button.Group>
                    <AdButton type="primary" onClick={e => this.saveInfo(e)} text="保存" />
                    {detailId && (
                        <AdButton
                            onClick={() => {
                                this.setState(preState => ({
                                    disabled: !preState.disabled,
                                }));
                            }}
                            text="取消"
                        />
                    )}
                </Button.Group>
            );
    };
    onRef = ref => {
        this.child = ref;
    };
    //添加
    addPreInfo = e => {
        e.stopPropagation();
        this.child.addInfo();
    };
    //移除
    removePreInfo = e => {
        e.stopPropagation();
        const { detailId, selectedRowsPre } = this.state;
        const { pressureInfoList } = this.props;
        const deleteIds = selectedRowsPre.map(v => v.id);
        this.deleteInfoIds = selectedRowsPre.filter(item => !item.id.includes('isNew')).map(v => v.id);
        const newData = pressureInfoList[detailId].list.filter(item => !deleteIds.includes(item.id));
        this.saveAllValue({ pressureInfoList: { [detailId]: { list: newData } } });
        this.handleStateChange([{ selectedRowsPre: [], showTips: true }]);
    };
    //表格显示提示：
    showTipsFun = val => {
        this.setState({
            showTips: val,
        });
    };

    render() {
        const { detailId, disabled, roles, showTips, selectedRowsPre, } = this.state;
        const { form, dataDetail, loading, dictObject } = this.props;
        const getFieldDecorator = form.getFieldDecorator;
        const detail = dataDetail[detailId] || {};

        const preTitle = (
            <span>
                明细
              {showTips && (
                    <span style={{ color: 'red', marginLeft: 30 }}>当前数据有变化，请注意保存</span>
                )}
            </span>
        );

        const editPageParams = {
            title: detail.roleName || '新增数据权限',
            headerOperate: this.headerOperate(),
            panelValue: [
                { key: '基础信息' },
                {
                    key: preTitle,
                    extra: (
                        <>
                            {/* <AdButton
                                onClick={e => {
                                    this.removePreInfo(e);
                                }}
                                ghost
                                disabled={disabled || selectedRowsPre.length === 0}
                                text="移除"
                                type="danger"
                            /> */}
                            <AdButton
                                type="primary"
                                // code={codes.addPressure}
                                disabled={disabled}
                                onClick={e => {
                                    this.addPreInfo(e);
                                }}
                                style={{ marginLeft: 8 }}
                                text="添加"
                            />
                        </>
                    ),
                },
            ],
        };
        const commonParams = {
            getFieldDecorator,
        };


        const formItem = [
            [
                <AntdFormItem
                    label="菜单名称"
                    code="menuId"
                    initialValue={detail ? detail.menuName : undefined}
                    {...commonParams}
                    rules={[{ required: true }]}
                >
                    {
                        detail.menuId ?
                            <AntdInput
                                disabled={true}
                            />
                            :
                            <AntdSelectRegion
                                url="mds-menu/selectFirstMenu"
                                paramsLabel="id"
                                label="name"
                                filter={false}
                                isParent={true}
                                disabled={disabled}
                                split="/"
                            />
                    }

                </AntdFormItem>,
                <AntdFormItem
                    rules={[{ required: true }]}
                    label="角色名称"
                    code="roleId"
                    initialValue={detail ? detail.roleName : roles}
                    {...commonParams}
                >
                    {
                        detail.roleName ?
                            <AntdInput
                                disabled={true}
                            /> :
                            <SearchSelect
                                dataUrl="mds-role/selectList"
                                selectedData={roles} // 选中值
                                showValue="name"
                                searchName="keyWord"
                                columns={columnsRole} // 表格展示列
                                scrollX={500}
                                onChange={this.getValue} // 获取选中值
                                id="dataAuthrity_1_2"
                                multiple={false}
                                disabled={disabled}
                            />
                    }
                </AntdFormItem>,
            ]
        ];

        return (
            <EditPage {...editPageParams}>
                <Spin spinning={detailId ? loading : false}>
                    <AntdForm>{formItemFragement(formItem)}</AntdForm>
                </Spin>
                <Fragment>
                    <DataFilter
                        detailId={detailId}
                        isMobile={this.props.isMobile}
                        showTipsFun={this.showTipsFun}
                        onlyRead={false}
                        onRef={this.onRef}
                        disabled={disabled}
                        selectedRows={selectedRowsPre}
                        onSelectRow={selectedRowsPre => this.handleStateChange([{ selectedRowsPre }])}

                    />
                </Fragment>
            </EditPage>
        );
    }
}
