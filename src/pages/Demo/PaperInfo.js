import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Row, Col } from 'antd';
import StandardTable from '@/components/StandardTable';
import AdModal from '@/components/AdModal';
import moment, { isDate } from 'moment';
import AntdForm from '@/components/AntdForm';
import AdSelect from '@/components/AdSelect';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import AntdDatePicker from '@/components/AntdDatePicker';
import AdUpload from '@/components/AdUpload';
import FileReader from '@/components/FileReader';
import { queryDictData, formatFile, queryDict } from '@/utils/common';
import { editCol, editGutter, editRow, allDictList } from '@/utils/constans';
import { dateFormat, allDispatchType } from './utils';

@connect(({ demo, loading, component }) => ({
  papersList: demo.papersList,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class PaperInfo extends Component {
  state = {
    id: '',
    detail: {},
  };

  componentWillMount() {
    const allDict = [allDictList.vehiclePapersType];
    queryDict({ props: this.props, allDict });
  }

  showDetail = id => {
    const { dispatch, setInfoModal } = this.props;
    this.setState({ id });
    dispatch({
      type: allDispatchType.papersDetails,
      payload: { id },
      callback: data => {
        if (!data) return;
        this.setState({ detail: data });
        setInfoModal();
      },
    });
  };

  renderType = (text, record) => {
    const { mode } = this.props;
    const content = (
      <AdSelect
        data={this.props.dictObject[allDictList.vehiclePapersType]}
        value={text}
        onlyRead={true}
        payload={{ code: allDictList.vehiclePapersType }}
      />
    );
    return content;
  };

  columns = [
    {
      title: '证件类型',
      dataIndex: 'type',
      width: 100,
      render: (text, record) => this.renderType(text, record),
    },
    {
      title: '证件号码',
      dataIndex: 'cardCode',
      width: 100,
    },
    {
      title: '有效期',
      dataIndex: 'time',
      render: (text, record) => (
        <span>
          {record.expiryStartTime} ~ {record.expiryEndTime}
        </span>
      ),
    },
    {
      title: '附件',
      dataIndex: 'attaQuantity',
      render: (text, record) => (
        <FileReader
          type="list"
          count={text}
          urlType="tms"
          params={{ bizId: record.id, fileBizType: 'VEHICLE_PAPERS' }}
        />
      ),
    },
    {
      title: '备注',
      dataIndex: 'remarks',
    },
  ];

  handleOk = () => {
    const { form, dispatch, setInfoModal, detailId } = this.props;
    const { id, detail } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { attachments, expiryTime, ...payload } = values;
      payload.expiryStartTime = moment(expiryTime[0]).format(dateFormat);
      payload.expiryEndTime = moment(expiryTime[1]).format(dateFormat);
      payload.fileTokens = attachments
        .filter(item => item.response && item.response.code == 0)
        .map(item => item.response.data);
      if (id) {
        payload.id = id;
        payload.deleteFileIds = detail.attachments
          .filter(
            item =>
              !attachments
                .filter(item => !item.response)
                .map(item => item.id)
                .includes(item.id)
          )
          .map(item => item.id);
      } else {
        payload.vehicleId = detailId;
      }
      dispatch({
        type: allDispatchType.paperOperate,
        payload,
        callback: data => {
          if (!data) return;
          this.setState({ detail: {}, id: '' });
          setInfoModal();
          dispatch({
            type: paperOperate.detail,
            payload: { id: detailId },
          });
        },
      });
    });
  };

  render() {
    const {
      papersList,
      form: { getFieldDecorator },
      detailId,
      dictObject,
      setInfoModal,
      visible,
    } = this.props;
    const { showDetail, detail, id } = this.state;
    const commonParams = {
      getFieldDecorator,
    };
    const formItem = [
      [
        <AntdFormItem
          label="证件类型"
          code="type"
          rules={[{ required: true }]}
          initialValue={detail.type}
          {...commonParams}
        >
          <AdSelect
            data={dictObject[allDictList.vehiclePapersType]}
            payload={{ code: allDictList.vehiclePapersType }}
          />
        </AntdFormItem>,
        <AntdFormItem
          label="证件号码"
          code="cardCode"
          rules={[{ required: true }]}
          initialValue={detail.cardCode}
          {...commonParams}
        >
          <AntdInput />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="有效期"
          code="expiryTime"
          rules={[{ required: true }]}
          initialValue={
            detail.expiryStartTime
              ? [
                  moment(detail.expiryStartTime, dateFormat),
                  moment(detail.expiryEndTime, dateFormat),
                ]
              : null
          }
          {...commonParams}
        >
          <AntdDatePicker mode="range" />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label="备注" code="remarks" initialValue={detail.remarks} {...commonParams}>
          <AntdInput mode="area" />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="图片"
          code="attachments"
          initialValue={detail.attachments}
          {...commonParams}
        >
          <AdUpload />
        </AntdFormItem>,
      ],
    ];
    return (
      <Fragment>
        <AdModal
          visible={visible}
          title={`${id ? '编辑' : '新增'}证件`}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({ detail: {}, id: '' });
            setInfoModal();
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
          disabledRowSelected={true}
          data={papersList[detailId] || {}}
          columns={this.columns}
          scrollX={500}
        />
      </Fragment>
    );
  }
}
