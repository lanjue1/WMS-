import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import { editCol, editGutter, editRow } from '@/utils/constans';
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import PaperInfo from './PaperInfo';
import DemoInfo from './DemoInfo';
import { queryDictData, queryDict } from '@/utils/common';
import { allDictList } from '@/utils/constans';
import { allDispatchType, codes } from './utils';

@connect(({ demo, component }) => ({
  selectDetails: demo.selectDetails,
  dictObject: component.dictObject,
}))
export default class DemoDetail extends Component {
  componentWillMount() {
    const allDict = [
      allDictList.coach,
      allDictList.vehicleType,
      allDictList.vehicleCategory,
      allDictList.vehicleProperties,
      allDictList.cabinetType,
    ];
    queryDict({ props: this.props, allDict });
  }

  render() {
    const { selectDetails, detailId, dictObject } = this.props;
    const detail = selectDetails[detailId] || {};
    const editPageParams = {
      panelTitle: [{ key: '基础信息' }, { key: '证件信息' }, { key: '临时司机' }],
    };
    const formItem = [
      [
        <DetailPage label="主车牌" value={detail.cartPlateOneNo} />,
        <DetailPage label="副车牌" value={detail.cartPlateTwoNo} />,
      ],
      [
        <DetailPage label="司机1" value={detail.mainDriverName} />,
        <DetailPage label="司机2" value={detail.deputyDriverName} />,
      ],
      [
        <DetailPage label="公司" value={detail.ownCompanyName} />,
        <DetailPage
          label="属性"
          value={
            <AdSelect
              data={dictObject[allDictList.vehicleProperties]}
              value={detail.property}
              onlyRead={true}
              payload={{ code: allDictList.vehicleProperties }}
            />
          }
        />,
      ],
      [
        <DetailPage
          label="分类"
          value={
            <AdSelect
              data={dictObject[allDictList.vehicleCategory]}
              value={detail.category}
              onlyRead={true}
              payload={{ code: allDictList.vehicleCategory }}
            />
          }
        />,
        <DetailPage
          label="车辆类型"
          value={
            <AdSelect
              data={dictObject[allDictList.vehicleType]}
              value={detail.cartType}
              onlyRead={true}
              payload={{ code: allDictList.vehicleType }}
            />
          }
        />,
      ],
      [
        <DetailPage label="所有人" value={detail.ownPersonName} />,
        <DetailPage label="品牌型号" value={detail.brandModel} />,
      ],
      [
        <DetailPage label="识别代号" value={detail.recognizeNo} />,
        <DetailPage label="发动机号码" value={detail.engineNo} />,
      ],
      [
        <DetailPage
          label="柜型"
          value={
            <AdSelect
              data={dictObject[allDictList.cabinetType]}
              value={detail.cabinetType}
              onlyRead={true}
              payload={{ code: allDictList.cabinetType }}
            />
          }
        />,
        <DetailPage label="柜号" value={detail.cabinetCode} />,
      ],
      [
        <DetailPage
          label="车厢"
          value={
            <AdSelect
              data={dictObject[allDictList.coach]}
              value={detail.coach}
              onlyRead={true}
              payload={{ code: allDictList.coach }}
            />
          }
        />,
        <DetailPage
          label="车厢尺寸(MM)"
          value={
            detail.coachInnerLength &&
            `${detail.coachInnerLength}*${detail.coachInnerWidth}*${detail.coachInnerHigh}`
          }
        />,
      ],
      [
        <DetailPage
          label="外廓尺寸(MM)"
          value={
            detail.gabariteLenght &&
            `${detail.gabariteLenght}*${detail.gabariteWidth}*${detail.gabariteHigh}`
          }
        />,
        <DetailPage label="车辆总质量(KG)" value={detail.totalWeight} />,
      ],
      [
        <DetailPage label="准牵引总质量(KG)" value={detail.accuratePullWeight} />,
        <DetailPage label="整备质量" value={detail.reconditionWeight} />,
      ],
      [
        <DetailPage label="核实载质量(KG)" value={detail.realHoldWeight} />,
        <DetailPage label="注册日期" value={detail.registerTime} />,
      ],
      [
        <DetailPage label="发证日期" value={detail.certificateTime} />,
        <DetailPage
          label="百公里平均油耗"
          value={
            detail.hundredExpendMin && `${detail.hundredExpendMin} 至 ${detail.hundredExpendMax}`
          }
        />,
      ],
      [
        <DetailPage label="车辆价格" value={detail.cartPrice} />,
        <DetailPage label="保养公里(KM)" value={detail.upkeepKm} />,
      ],
      [
        <DetailPage label="保养周期(月)" value={detail.upkeepCycle} />,
        <DetailPage label="状态" value={detail.beActive ? '启用' : '禁用'} />,
      ],
      [<DetailPage label="司机" value={<AdSearch value={detail.drivers} onlyRead={true} />} />],
      [<DetailPage label="备注" value={detail.remarks} />],
    ];
    return (
      <EditPage {...editPageParams}>
        <Fragment>
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
        </Fragment>
        <Fragment>
          <PaperInfo detailId={detailId} mode="detail" />
        </Fragment>
        <Fragment>
          <DemoInfo detailId={detailId} mode="detail" />
        </Fragment>
      </EditPage>
    );
  }
}
