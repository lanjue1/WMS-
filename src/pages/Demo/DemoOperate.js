import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button } from 'antd';
import moment from 'moment';
import AntdDatePicker from '@/components/AntdDatePicker';
import EditPage from '@/components/EditPage';
import AntdForm from '@/components/AntdForm';
import AdSelect from '@/components/AdSelect';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import AdInput from '@/components/AdInput';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import AdButton from '@/components/AdButton';
import SearchSelect from '@/components/SearchSelect';
import { editCol, editGutter, editRow, allDictList } from '@/utils/constans';
import { queryDictData, queryPerson, queryDict, columnsDriver } from '@/utils/common';
import { plateList, dateFormat, allDispatchType, codes, routeUrl } from './utils';
import PaperInfo from './PaperInfo';
import DemoInfo from './DemoInfo';
const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ demo, component }) => ({
  selectDetails: demo.selectDetails,
  ownCompany: component.ownCompany,
  dictObject: component.dictObject,
  formValues: demo.formValues,
}))
@Form.create()
export default class DemoOperate extends Component {
  state = {
    detailId: '',
    visible: false,
    disabled: false,
    mainDriver: [],
    deputyDriver: [],
    selectedRows: [],
  };

  componentWillMount() {
    const { dictObject, dispatch, ownCompany } = this.props;
    queryDictData({
      dispatch,
      type: 'component/queryOwnCompany',
      isExist: ownCompany.length > 0,
    });
    const allDict = [
      allDictList.coach,
      allDictList.vehicleProperties,
      allDictList.vehicleType,
      allDictList.vehicleCategory,
      allDictList.cabinetType,
    ];
    queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      selectDetails,
      dispatch,
    } = this.props;
    if (!id) return;
    this.setState({ detailId: id });
    if (selectDetails[id]) {
      this.setTabName({ id, name: selectDetails[id].cartPlateOneNo });
    } else {
      dispatch({
        type: allDispatchType.detail,
        payload: { id },
        callback: data => {
          if (!data) return;
          this.setState({
            mainDriver: data.mainDriverId ? [{ id: data.mainDriverId }] : [],
            deputyDriver: data.deputyDriverId ? [{ id: data.deputyDriverId }] : [],
          });
          this.setTabName({
            id,
            name: data.cartPlateOneNo,
          });
        },
      });
    }
  }

  setTabName = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/setTabsName',
      payload,
      // callback: data,
    });
  };

  selectVehicleList = ({ payload = {} } = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: allDispatchType.list,
      payload,
      callback: data => {
        if (!data) return;
        queryPerson({ data, searchValue, dispatch });
      },
    });
  };

  /**
   * ????????????
   */
  saveInfo = () => {
    const { form, dispatch, selectDetails, formValues } = this.props;
    const { detailId, mainDriver, deputyDriver } = this.state;
    const detail = selectDetails[detailId];
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const {
        drivers,
        cartPlateTypeOne,
        cartPlateTypeTwo,
        cartPlateOneNo,
        cartPlateTwoNo,
        certificateTime,
        registerTime,
        ...payload
      } = values;
      if (certificateTime) {
        payload.certificateTime = moment(certificateTime).format(dateFormat);
      }
      if (registerTime) {
        payload.registerTime = moment(registerTime).format(dateFormat);
      }
      payload.mainDriverId = mainDriver.length > 0 ? mainDriver[0].id : '';
      payload.deputyDriverId = deputyDriver.length > 0 ? deputyDriver[0].id : '';

      payload.cartPlateTwoNo =
        cartPlateTypeTwo == '?????????'
          ? cartPlateTwoNo
          : cartPlateTypeTwo
          ? cartPlateTypeTwo + cartPlateTwoNo
          : cartPlateTwoNo;

      if (detailId !== '') {
        payload.id = detailId;
      } else {
        if (cartPlateTypeOne) {
          payload.cartPlateOneNo =
            cartPlateTypeOne == '?????????'
              ? cartPlateOneNo
              : cartPlateTypeOne
              ? cartPlateTypeOne + cartPlateOneNo
              : cartPlateOneNo;
        } else {
          prompt({ title: '????????????', content: '??????????????????', type: 'warn' });
          return;
        }
      }
      dispatch({
        type: allDispatchType.operate,
        payload,
        callback: data => {
          if (!data) return;
          this.setState(preState => ({
            disabled: !preState.disabled,
          }));
          this.selectVehicleList({ payload: formValues });
          dispatch({
            type: allDispatchType.detail,
            payload: { id: data },
            callback: res => {
              if (!res) return;
              this.setState({
                mainDriver: res.mainDriverId ? [{ id: res.mainDriverId }] : [],
                deputyDriver: res.deputyDriverId ? [{ id: res.deputyDriverId }] : [],
              });

              if (detailId === '') {
                this.setTabName({
                  id: data,
                  isReplaceTab: true,
                  name: res.cartPlateOneNo,
                  callback: result => {
                    if (result) {
                      router.push(`${routeUrl.edit}/${id}`);
                    }
                  },
                });
              }
            },
          });
        },
      });
    });
  };

  infoDriverAdd = e => {
    e.stopPropagation();
    this.setInfoDriverModal();
  };

  //??????????????????
  delRecord = (e, id) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { selectedRows, detailId } = this.state;
    let ids = selectedRows.map(v => v.id);
    dispatch({
      type: allDispatchType.deleteVehicleDriver,
      payload: { ids },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        this.getVehicleDriverList(detailId);
      },
    });
  };
  getSelectedRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  //????????????????????????
  getVehicleDriverList = id => {
    const { dispatch } = this.props;
    dispatch({
      type: allDispatchType.vehicleDriverList,
      payload: { id },
    });
  };

  setInfoDriverModal = () => {
    this.setState(preState => ({
      visible: !preState.visible,
    }));
  };

  getValue = (values, type) => {
    this.setState({
      [type]: values,
    });
  };

  headerOperate = () => {
    const { detailId, disabled } = this.state;
    return disabled ? (
      <AdButton
        type="primary"
        onClick={() => {
          this.setState(preState => ({
            disabled: !preState.disabled,
          }));
        }}
        text="??????"
        code={detailId ? codes.edit : codes.add}
      />
    ) : (
      <Button.Group>
        <AdButton
          text="??????"
          type="primary"
          code={detailId ? codes.edit : codes.add}
          onClick={this.saveInfo}
        />
        {detailId && (
          <AdButton
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text="??????"
            code={detailId ? codes.edit : codes.add}
          />
        )}
      </Button.Group>
    );
  };

  render() {
    const { detailId, visible, mainDriver, deputyDriver, selectedRows, disabled } = this.state;
    const {
      form: { getFieldDecorator },
      selectDetails,
      ownCompany,
      dictObject,
    } = this.props;
    const detail = selectDetails[detailId] || {};
    const editPageParams = {
      headerOperate: this.headerOperate(),
      title: detail ? detail.cartPlateOneNo : '????????????',
      saveInfo: this.saveInfo,
      panelTitle: [
        { key: '????????????' },
        detailId && { key: '????????????' },
        detailId && {
          key: '????????????',
          extra: (
            <>
              <AdButton
                type="danger"
                onClick={e => this.delRecord(e, detailId)}
                disabled={disabled || !selectedRows.length > 0}
                text="??????"
                ghost
                code={codes.deleteTemp}
              />
              <AdButton
                style={{ marginLeft: 8 }}
                type="primary"
                onClick={this.infoDriverAdd}
                text="??????"
                disabled={disabled}
                code={codes.addTemp}
              ></AdButton>
            </>
          ),
        },
      ],
    };
    const commonParams = {
      getFieldDecorator,
    };

    const prefixSelector = (name, type) => (
      <AntdFormItem code={name} initialValue={undefined} {...commonParams}>
        <AdSelect
          data={plateList}
          isExist={true}
          allowClear={type == 2 ? true : false}
          show={{ id: 'key', name: 'val' }}
          style={{ width: 120 }}
          disabled={disabled}
        />
      </AntdFormItem>
    );

    const formItem = [
      [
        <AntdFormItem
          label="?????????"
          code="cartPlateOneNo"
          rules={[{ required: true }]}
          initialValue={detail ? detail.cartPlateOneNo : ''}
          {...commonParams}
        >
          {detail ? (
            <AntdInput disabled={true} />
          ) : (
            <AntdInput addonBefore={prefixSelector('cartPlateTypeOne', 1)} disabled={disabled} />
          )}
        </AntdFormItem>,
        <AntdFormItem
          label="?????????"
          code="cartPlateTwoNo"
          initialValue={detail ? detail.cartPlateTwoNo : ''}
          {...commonParams}
        >
          {detail ? (
            <AntdInput disabled={true} />
          ) : (
            <AntdInput disabled={disabled} addonBefore={prefixSelector('cartPlateTypeTwo', 2)} />
          )}
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="??????1"
          code="mainDriverId"
          initialValue={detail ? detail.mainDriverId : undefined}
          {...commonParams}
        >
          <SearchSelect
            dataUrl="tms/tms-vehicle/selectDriverList"
            url="tms/tms-vehicle/selectDriverView_s"
            multiple={false} // ????????????
            selectedData={mainDriver} // ?????????
            columns={columnsDriver} // ???????????????
            onChange={val => this.getValue(val, 'mainDriver')} // ???????????????
            id="managerCar_1"
            allowClear={true}
            disabled={disabled}
          />
        </AntdFormItem>,
        <AntdFormItem
          label="??????2"
          code="deputyDriverId"
          initialValue={detail ? detail.deputyDriverId : undefined}
          {...commonParams}
        >
          <SearchSelect
            dataUrl="tms/tms-vehicle/selectDriverList"
            url="tms/tms-vehicle/selectDriverView_s"
            multiple={false} // ????????????
            selectedData={deputyDriver} // ?????????
            columns={columnsDriver} // ???????????????
            onChange={val => this.getValue(val, 'deputyDriver')} // ???????????????
            id="managerCar_2"
            allowClear={true}
            disabled={disabled}
          />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="??????"
          code="ownCompanyId"
          rules={[{ required: true }]}
          initialValue={detail ? detail.ownCompanyId : undefined}
          {...commonParams}
        >
          <AdSelect
            disabled={disabled}
            data={ownCompany}
            url="mds/d-customer/selectCompany"
            show={{ id: 'customerCode', name: 'customerName' }}
          />
        </AntdFormItem>,
        <AntdFormItem
          label="??????"
          code="property"
          rules={[{ required: true }]}
          initialValue={detail ? detail.property : undefined}
          {...commonParams}
          disabled={disabled}
        >
          <AdSelect
            disabled={disabled}
            data={dictObject[allDictList.vehicleProperties]}
            payload={{ code: allDictList.vehicleProperties }}
          />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="??????"
          code="category"
          rules={[{ required: true }]}
          initialValue={detail ? detail.category : undefined}
          {...commonParams}
        >
          <AdSelect
            disabled={disabled}
            data={dictObject[allDictList.vehicleCategory]}
            payload={{ code: allDictList.vehicleCategory }}
          />
        </AntdFormItem>,
        <AntdFormItem
          label="????????????"
          code="cartType"
          rules={[{ required: true }]}
          initialValue={detail ? detail.cartType : undefined}
          {...commonParams}
        >
          <AdSelect
            disabled={disabled}
            data={dictObject[allDictList.vehicleType]}
            payload={{ code: allDictList.vehicleType }}
          />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="?????????"
          code="ownPersonName"
          initialValue={detail ? detail.ownPersonName : ''}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label="????????????"
          code="brandModel"
          initialValue={detail ? detail.brandModel : ''}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="????????????"
          code="recognizeNo"
          initialValue={detail ? detail.recognizeNo : ''}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label="???????????????"
          code="engineNo"
          initialValue={detail ? detail.engineNo : ''}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="??????"
          code="cabinetType"
          initialValue={detail.cabinetType || undefined}
          {...commonParams}
        >
          <AdSelect
            isExist={true}
            data={dictObject[allDictList.cabinetType]}
            payload={{ code: allDictList.cabinetType }}
            disabled={disabled}
          />
        </AntdFormItem>,
        <AntdFormItem
          label="??????"
          code="cabinetCode"
          initialValue={detail.cabinetCode}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="??????"
          code="coach"
          initialValue={detail ? detail.coach : undefined}
          {...commonParams}
        >
          <AdSelect
            disabled={disabled}
            data={dictObject[allDictList.coach]}
            payload={{ code: allDictList.coach }}
          />
        </AntdFormItem>,
        <FormItem label="????????????(MM)">
          <Row gutter={8}>
            {[
              { code: 'coachInnerLength', placeholder: '???' },
              { code: 'coachInnerWidth', placeholder: '???' },
              { code: 'coachInnerHigh', placeholder: '???' },
            ].map(v => {
              return (
                <Col span={8} key={v.code}>
                  <AntdFormItem
                    code={v.code}
                    initialValue={detail ? detail[v.code] : ''}
                    {...commonParams}
                  >
                    <AntdInput disabled={disabled} placeholder={v.placeholder} />
                  </AntdFormItem>
                </Col>
              );
            })}
          </Row>
        </FormItem>,
      ],
      [
        <FormItem label="????????????(MM)">
          <Row gutter={8}>
            {[
              { code: 'gabariteLenght', placeholder: '???' },
              { code: 'gabariteWidth', placeholder: '???' },
              { code: 'gabariteHigh', placeholder: '???' },
            ].map(v => {
              return (
                <Col span={8} key={v.code}>
                  <AntdFormItem
                    code={v.code}
                    initialValue={detail ? detail[v.code] : ''}
                    {...commonParams}
                  >
                    <AntdInput disabled={disabled} placeholder={v.placeholder} />
                  </AntdFormItem>
                </Col>
              );
            })}
          </Row>
        </FormItem>,
        <></>,
      ],
      [
        <AntdFormItem
          label="???????????????(KG)"
          code="totalWeight"
          initialValue={detail ? detail.totalWeight : ''}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label="??????????????????(KG)"
          code="accuratePullWeight"
          initialValue={detail ? detail.accuratePullWeight : ''}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="????????????(KG)"
          code="reconditionWeight"
          initialValue={detail ? detail.reconditionWeight : ''}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label="???????????????(KG)"
          code="realHoldWeight"
          initialValue={detail ? detail.realHoldWeight : ''}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="????????????"
          code="registerTime"
          initialValue={
            detail && detail.registerTime ? moment(detail.registerTime, dateFormat) : null
          }
          {...commonParams}
        >
          <AntdDatePicker disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label="????????????"
          code="certificateTime"
          initialValue={
            detail && detail.certificateTime ? moment(detail.certificateTime, dateFormat) : null
          }
          {...commonParams}
        >
          <AntdDatePicker disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <FormItem label="?????????????????????">
          <Row gutter={8}>
            <Col span={11}>
              <AntdFormItem
                code="hundredExpendMin"
                initialValue={detail ? detail.hundredExpendMin : ''}
                {...commonParams}
              >
                <AntdInput disabled={disabled} placeholder="min" />
              </AntdFormItem>
            </Col>
            <Col span={2}>~</Col>
            <Col span={11}>
              <AntdFormItem
                code="hundredExpendMax"
                initialValue={detail ? detail.hundredExpendMax : ''}
                {...commonParams}
              >
                <AntdInput disabled={disabled} placeholder="max" />
              </AntdFormItem>
            </Col>
          </Row>
        </FormItem>,
        <AntdFormItem
          label="????????????"
          code="cartPrice"
          initialValue={detail ? detail.cartPrice : ''}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="????????????(KM)"
          code="upkeepKm"
          initialValue={detail ? detail.upkeepKm : ''}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label="????????????(???)"
          code="upkeepCycle"
          initialValue={detail ? detail.upkeepCycle : ''}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="??????"
          code="remarks"
          initialValue={detail ? detail.remarks : ''}
          {...commonParams}
        >
          <TextArea disabled={disabled} rows={4} />
        </AntdFormItem>,
      ],
    ];

    return (
      <EditPage {...editPageParams}>
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
        {detailId && (
          <Fragment>
            <PaperInfo detailId={detailId} disabled={disabled} />
          </Fragment>
        )}

        {detailId && (
          <Fragment>
            <DemoInfo
              detailId={detailId}
              disabled={disabled}
              visible={visible}
              setInfoModal={this.setInfoDriverModal}
              getSelectedRows={this.getSelectedRows}
              mode="list"
            />
          </Fragment>
        )}
      </EditPage>
    );
  }
}
