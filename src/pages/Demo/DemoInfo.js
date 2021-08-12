import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input } from 'antd';
import StandardTable from '@/components/StandardTable';
import AdModal from '@/components/AdModal';
import moment, { isDate } from 'moment';
import AntdForm from '@/components/AntdForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import AntdDatePicker from '@/components/AntdDatePicker';
import AdUpload from '@/components/AdUpload';
import SearchSelect from '@/components/SearchSelect';
import { queryDictData, formatFile, queryDict, columnsDriver } from '@/utils/common';
import { editCol, editGutter, editRow, allDictList } from '@/utils/constans';
import { dateFormat, driverType, allDispatchType, codes } from './utils';

const { TextArea } = Input;
const dateFormat1 = 'YYYY-MM-DD HH:mm';

@connect(({ demo, loading, component }) => ({
  vehicleDriverList: demo.vehicleDriverList,
  detailsDriver: demo.detailsDriver,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class DemoInfo extends Component {
  state = {
    id: '',
    detail: {},
    selectedRows: [],
  };

  componentWillMount() {
    const allDict = [allDictList.vehiclePapersType];
    queryDict({ props: this.props, allDict });
  }
  componentDidMount() {
    this.getVehicleDriverList();
  }

  //车辆司机关系表：
  getVehicleDriverList = () => {
    const { dispatch, detailId } = this.props;
    dispatch({
      type: allDispatchType.vehicleDriverList,
      payload: { id: detailId },
    });
  };

  showDetail = id => {
    const { dispatch } = this.props;
    this.setModal();
    this.setState({ id });
    dispatch({
      type: allDispatchType.vehicleDriverDetails,
      payload: { id },
      callback: data => {
        if (!data) return;
        this.setState({
          drivers: data.driverId ? [{ id: data.driverId }] : [],
        });
      },
    });
  };
  setModal = () => {
    const { setInfoModal } = this.props;
    this.setState({
      drivers: [],
      id: '',
    });
    setInfoModal();
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'driverName',
      render: (text, record) =>
        this.props.mode == 'list' && !this.props.disabled ? (
          <AdButton
            mode="a"
            onClick={e => this.showDetail(record.id)}
            text={text}
            code={codes.editTemp}
          />
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: '工号',
      dataIndex: 'workerNo',
    },
    {
      title: '类型',
      dataIndex: 'driverType',
      render: text => <span>{text == 'main-driver' ? '临时司机1' : '临时司机2'}</span>,
    },
    {
      title: '有效期',
      dataIndex: 'time',
      width: 250,
      render: (text, record) => {
        const sTime = record.effectivePeriodBegin
          ? moment(record.effectivePeriodBegin).format(dateFormat)
          : '';
        const eTime = record.effectivePeriodOver
          ? moment(record.effectivePeriodOver).format(dateFormat)
          : '';
        return <span title={`${sTime}~${eTime}`}>{`${sTime}~${eTime}`}</span>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      render: text => <span title={text}>{text}</span>,
    },
  ];

  handleOk = e => {
    const { id, drivers } = this.state;
    const { detailId, titleType, form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { effectivePeriod, ...value } = values;
      value.effectivePeriodBegin = effectivePeriod
        ? moment(effectivePeriod[0]).format(dateFormat1)
        : '';
      value.effectivePeriodOver = effectivePeriod
        ? moment(effectivePeriod[1]).format(dateFormat1)
        : '';
      value.driverId = drivers.length > 0 ? drivers[0].id : '';
      value.vehicleId = detailId;
      if (id) {
        value.id = id;
      }
      dispatch({
        type: allDispatchType.vehicleDriverOperate,
        payload: value,
        callback: data => {
          this.setModal();
          this.getVehicleDriverList(id);
        },
      });
    });
  };

  handleSelectRows = rows => {
    const { getSelectedRows } = this.props;
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
    getSelectedRows(rows);
  };

  getValue = values => {
    this.setState({
      drivers: values,
    });
  };

  handleStandardTableChange = values => {
    const { detailId, dispatch } = this.props;
    dispatch({
      type: allDispatchType.vehicleDriverList,
      payload: { id: detailId, ...values },
    });
  };

  render() {
    const {
      vehicleDriverList,
      form: { getFieldDecorator },
      detailId,
      dictObject,
      visible,
      disabled,
      detailsDriver,
      mode,
      loading,
    } = this.props;
    const { showDetail, id, drivers, selectedRows } = this.state;
    const detail = id ? detailsDriver[id] || {} : {};
    const commonParams = {
      getFieldDecorator,
    };
    const formItem = [
      [
        <AntdFormItem
          label="司机"
          code="driverId"
          rules={[{ required: true }]}
          initialValue={detail.driverId}
          {...commonParams}
        >
          <SearchSelect
            multiple={false} // 是否多选
            dataUrl="tms/tms-vehicle/selectDriverList"
            url="tms/tms-vehicle/selectDriverView_s"
            selectedData={drivers} // 选中值
            columns={columnsDriver} // 表格展示列
            onChange={this.getValue} // 获取选中值
            id="managerCar_driverList"
            disabled={id ? true : disabled}
          />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="类型"
          code="driverType"
          rules={[{ required: true }]}
          initialValue={detail.driverType}
          {...commonParams}
        >
          <AdSelect data={driverType} isExist={true} disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="有效期"
          code="effectivePeriod"
          rules={[{ required: true }]}
          initialValue={
            detail.effectivePeriodBegin
              ? [
                  moment(detail.effectivePeriodBegin, dateFormat),
                  moment(detail.effectivePeriodOver, dateFormat),
                ]
              : null
          }
          {...commonParams}
        >
          <AntdDatePicker mode="range" showTime disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label="备注" code="remarks" initialValue={detail.remarks} {...commonParams}>
          <TextArea rows={4} />
        </AntdFormItem>,
      ],
    ];
    return (
      <Fragment>
        <AdModal
          visible={visible}
          title={`${id ? '编辑' : '新增'}司机`}
          onOk={this.handleOk}
          onCancel={() => {
            this.setModal();
          }}
        >
          <AntdForm>
            {formItem.map((item, index) => {
              return (
                <Row gutter={editGutter} key={index}>
                  {item.map((v, i) => {
                    const colSpan = item.length === 1 ? editRow : editCol;
                    return (
                      <Col {...colSpan} key={index + i}>
                        {v}
                      </Col>
                    );
                  })}
                </Row>
              );
            })}
          </AntdForm>
        </AdModal>
        <StandardTable
          disabledRowSelected={mode == 'detail' || disabled}
          data={vehicleDriverList[detailId] || {}}
          columns={this.columns}
          scrollX={500}
          selectedRows={selectedRows}
          onSelectRow={this.handleSelectRows}
          onPaginationChange={this.handleStandardTableChange}
          loading={loading}
        />
      </Fragment>
    );
  }
}
