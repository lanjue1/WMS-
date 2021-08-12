import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';
import { formItemFragement, queryDict } from '@/utils/common';
import { allDictList } from '@/utils/constans';
import DataFilter from './DataFilter';
import { dataDetail, renderTableAdSelect, allDispatchType, IcCardStatus } from './utils';

@connect(({ dataAuthority, loading, component }) => ({
    dataDetail: dataAuthority.dataDetail,
    dictObject: component.dictObject,
    loading: loading.effects[allDispatchType.detail],
}))
export default class DeclareDetail extends Component {
    state = {
        detailId: '',
    };

    componentWillMount() {
        // 查询字典项
        // const allDict = [allDictList.manifest_transport, allDictList.manifest_goods];
        // queryDict({ props: this.props, allDict });
    }
    componentDidMount() {
        const { detailId, match } = this.props;
        const currentId = match && match.params.id ? match.params.id : detailId;
        if (!currentId) return;
        this.handleStateChange([{ detailId: currentId }]);
        this.dataDetail();
    }

    dataDetail = () => {
        const { detailId, match } = this.props;
        const currentId = match && match.params.id ? match.params.id : detailId;
        currentId &&
            dataDetail({
                type: allDispatchType.detail,
                payload: { id: currentId },
                props: this.props,
            });
    };

    handleStateChange = (options = []) => {
        options.map(item => {
            this.setState(item);
        });
    };

    render() {
        const { loading, dataDetail } = this.props;
        const { detailId } = this.state;
        const detail = dataDetail[detailId] || {};

        const editPageParams = {
            panelValue: [
                { key: '基础信息' },
                { key: '明细' },
            ],
        };

        const formItem = [
            [
                <DetailPage label="角色名称" value={detail.roleName} />,
                <DetailPage label="状态" value={detail.status === "true" ? '正常' : '未生效'} />,
            ],
            [
                <DetailPage label="菜单名称" value={detail.menuName} />,
                <DetailPage label="接口地址" value={detail.url} />,
            ],
            [
                <DetailPage label="角色code" value={detail.sysCode} />,
                <DetailPage label="角色说明" value={detail.remarks} />,
            ],
        ];

        return (
            <Fragment>
                <EditPage {...editPageParams}>
                    <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
                    <Fragment>
                        <DataFilter
                            detailId={detailId}
                            mode="detail"
                            isMobile={this.props.isMobile}
                            onlyRead={true}
                            disabled={true}
                        />
                    </Fragment>
                </EditPage>
            </Fragment>
        );
    }
}
