import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import AdModal from '@/components/AdModal';
import SelectForm from '@/components/SelectForm';
import RightDraw from '@/components/RightDraw';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import prompt from '@/components/Prompt';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import FileImport from '@/components/FileImport';
import { queryDict, formateDateToMin } from '@/utils/common';
import AdSearch from '@/components/AdSearch';
import AdSelect from '@/components/AdSelect';
import AntdDatePicker from '@/components/AntdDatePicker';
import { allDictList } from '@/utils/constans';
import {
  selectSequenceList,
  saveAllValues,
  codes,
  allDispatchType,
  routeUrl,
  sequenceDetail,
  renderTableAdSelect,
  SequenceStatus,
} from './utils';
import SequenceDetail from './SequenceDetail';
import styles from './sequence.less';
import { transferLanguage } from '@/utils/utils';

const { confirm } = Modal;

@ManageList
@connect(({ sequence, loading, component, i18n }) => ({
  sequence,
  sequenceList: sequence.sequenceList,
  sequenceDetail: sequence.sequenceDetail,
  formValues: sequence.formValues,
  searchValue: component.searchValue,
  loading: loading.effects[allDispatchType.list],
  language: i18n.language
}))
@Form.create()
export default class ICCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      //visible: false,
      detailId: '',
      selectedRows: [],
      checkId: '',
      checkIds: [],
      adjustVisible: false
    };
    this.className = 'sequence-table';
  }
  componentWillMount() {
    
  }
  componentDidMount() {
    selectSequenceList({ props: this.props });
  }
  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => (<span>{index + 1}</span>),
      width: 50
    },
    {
      title: transferLanguage('SequenceList.field.TypeName', this.props.language),
      dataIndex: 'sequenceType',
      // render: (text, record) => {
      //   const _text = renderTableAdSelect({
      //     props: this.props,
      //     value: text,
      //     key: allDictList.sequenceType,
      //   });
      //   return (
      //     <AdButton
      //       mode="a"
      //       onClick={e => this.showDetail(e, record.id)}
      //       text={_text}
      //       code={codes.showDetail}
      //     />
      //   );
      // },
      fixed: this.props.isMobile ? false : true,
    },
    {
      title: transferLanguage('SequenceList.field.currentValue', this.props.language),
      dataIndex: 'curStep',
      width: 100,
    },
    {
      title: transferLanguage('SequenceList.field.DeletedOrNot', this.props.language),
      dataIndex: 'beDeleted',
      render: text => <span>{text ? '是' : '否'}</span>,
      width: 100,
    },
    {
      title: transferLanguage('SequenceList.field.lengthOfTheNumber', this.props.language),
      dataIndex: 'codeLength',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: transferLanguage('SequenceList.field.prefix', this.props.language),
      dataIndex: 'fix',
    },
    {
      title: transferLanguage('SequenceList.field.dateFormat', this.props.language),
      dataIndex: 'formatStr',
      render: text => <span title={text}>{text}</span>,
      width: 250,
    },
    {
      title: transferLanguage('SequenceList.field.GrowthStep', this.props.language),
      dataIndex: 'incrementStep',
    },
    {
      title: transferLanguage('SequenceList.field.maximum', this.props.language),
      dataIndex: 'maxValue',
    },
    {
      title: transferLanguage('SequenceList.field.BaseUnit', this.props.language),
      dataIndex: 'scale',
    },
    {
      title: transferLanguage('SequenceList.field.founder', this.props.language),
      dataIndex: 'createBy',
      render: text => (
        <AdSearch
          label="loginName"
          name="sysName"
          value={this.props.searchValue[text]}
          onlyRead={true}
        />
      ),
    },
    {
      title: transferLanguage('SequenceList.field.createTime', this.props.language),
      dataIndex: 'createTime',
      render: text => <span>{text ? moment(text).format(formateDateToMin) : ''}</span>,
    },
    {
      title: transferLanguage('SequenceList.field.updateBy', this.props.language),
      dataIndex: 'updateBy',
      render: text => (
        <AdSearch
          label="loginName"
          name="sysName"
          value={this.props.searchValue[text]}
          onlyRead={true}
        />
      ),
    },
    {
      title: transferLanguage('SequenceList.field.updateTime', this.props.language),
      dataIndex: 'updateTime',
      render: text => <span>{text ? moment(text).format(formateDateToMin) : ''}</span>,
    },
  ];
  //右侧弹窗详情页---修改
  sequenceDetail = () => {
    const { detailId } = this.state;
    sequenceDetail({
      type: allDispatchType.detail,
      payload: { id: detailId },
      props: this.props,
    });
  };

  /**
   * form 查找条件 重置
   */
  handleFormReset = () => {
    const { form } = this.props;
    const props = { props: this.props };
    form.resetFields();
    saveAllValues({ payload: { formValues: {} }, ...props });
    selectSequenceList({ ...props });
  };

  /**
   * form 查找条件 查询
   */
  handleSearch = formValues => {
    if (!formValues) return;
    const { unloadTime, ...value } = formValues;
    const params = { props: this.props, payload: value };
    saveAllValues({ payload: { formValues: value }, props: this.props });
    selectSequenceList(params);
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
  /**
   * table 表格 分页操作
   */
  handleStandardTableChange = param => {
    const { formValues } = this.props;
    selectSequenceList({ payload: { ...formValues, ...param }, props: this.props });
  };

  //详情
  showDetail = (e, detailId) => {
    e.stopPropagation();
    this.handleStateChange([{ detailId }, { visible: true }]);
  };

  handleStateChange = (options = []) => {
    options.map(item => {
      this.setState(item);
    });
  };

  //新建
  handleAdd = () => {
    router.push(routeUrl.add);
  };

  //编辑
  handleEdit = () => {
    const { detailId } = this.state;
    this.handleStateChange([{ visible: false }]);
    router.push(`${routeUrl.edit}/${detailId}`);
  };

  // 调整步长
  curStep = () => {
    const { dispatch, form: { getFieldValue } } = this.props
    const { checkIds, adjustVisible, formValues } = this.state
    const curStep = getFieldValue('curStep')
    let type = 'sequence/curStep'
    dispatch({
      type: type,
      payload: { id: checkIds[0], curStep },
      callback: data => {
        this.setState({ adjustVisible: false });
        selectSequenceList({ payload: { ...formValues }, props: this.props });
      }
    })
  }
  //启用、禁用：
  abledStatus = (type, isSingle) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    dispatch({
      type: 'sequence/ableOperate',
      payload: params,
      callback: res => {
        this.handleSearch(formValues);

        if (isSingle) {
          this.props.dispatch({
            type: 'sequence/selectSequenceDetails',
            payload: { id: checkId },
            callback: res => {
              this.setState({
                isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
              });
            },
          });
        }
      },
    });
  };
  //删除
  removeRecord = () => {
    const { dispatch, formValues } = this.props;
    const { detailId } = this.state;
    confirm({
      title: transferLanguage('SequenceList.field.AreYouSureYouWantToDeleteThisData', this.props.language),
      content: ' ',
      okText: transferLanguage('SequenceList.field.determine', this.props.language),
      okType: 'danger',
      cancelText: transferLanguage('SequenceList.field.cancel', this.props.language),
      onOk: () => {
        dispatch({
          type: allDispatchType.delete,
          payload: { id: detailId },
          callback: () => {
            this.setState({ visible: false });
            selectSequenceList({ payload: { ...formValues }, props: this.props });
          },
        });
      },
    });
  };

  render() {
    const { sequenceList, loading, form, isMobile, language } = this.props;
    const { expandForm, detailId, visible, selectedRows,adjustVisible } = this.state;

    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const firstFormItem = (
      <AntdFormItem label={transferLanguage('SequenceList.field.TypeName', this.props.language)} code="sequenceType" {...commonParams}>
        <Input />
       
      </AntdFormItem>
    );
    const secondFormItem = (
      <AntdFormItem label={transferLanguage('SequenceList.field.prefix', this.props.language)} code="fix" {...commonParams}>
        <Input />
      </AntdFormItem>
    );
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      form,
      className: this.className,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      toggleForm: expandForm => {
        this.handleStateChange([{ expandForm }]);
      },
      code: codes.select,
    };
    const tableButtonsParams = {
      // handleAdd: this.handleAdd,
      code: codes.add,
      buttons: (
        <Button.Group>
          {/* <Button
            onClick={() => this.abledStatus('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('SequenceList.field.disabled', this.props.language)}
        </Button>
          <Button
            onClick={() => this.abledStatus('abled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('SequenceList.field.enable', this.props.language)}
        </Button> */}
          <Button
            onClick={() => this.setState({ adjustVisible: true })}
            disabled={selectedRows.length === 1 ? false : true}
          >
            {transferLanguage('SequenceList.field.AdjustTheStep', this.props.language)}
        </Button>
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    // 详情 参数
    const rightDrawParams = {
      isMobile,
      visible,
      title: transferLanguage('SequenceList.field.DetailsOfTheSerialNumber', this.props.language),
      code: codes.showDetail,
      mode: 'rightDraw',
      closeDetail: this.handleStateChange.bind(this, [{ visible: false }]),
      buttons: (
        <Button.Group>
          <AdButton
            onClick={() => this.removeRecord(1)}
            text={transferLanguage('SequenceList.field.delete', this.props.language)}
            type="danger"
            code={codes.remove}
          />
          <AdButton onClick={() => this.handleEdit()} text={transferLanguage('SequenceList.field.edit', this.props.language)} />
        </Button.Group>
      ),
    };

    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          loading={loading}
          data={sequenceList}
          selectedRows={selectedRows}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChange}
          expandForm={expandForm}
          className={this.className}
          code={codes.page}
          //disabledRowSelected={true}
          onSelectRow={this.handleSelectRows}
        />
        <RightDraw {...rightDrawParams}>
          <SequenceDetail detailId={detailId} pageType="rightDraw" />
        </RightDraw>
        {adjustVisible && <AdModal
          visible={adjustVisible}
          title={transferLanguage('SequenceList.field.AdjustTheStep', this.props.language)}
          onOk={() => this.curStep()}
          onCancel={() => this.setState({ adjustVisible: !adjustVisible })}
          width='600px'

        >
          <div>
            <AntdFormItem label={transferLanguage('SequenceList.field.waterValue', this.props.language)}
              code="curStep"
              {...commonParams}
            >
              <Input />
            </AntdFormItem>
          </div>
        </AdModal>}
      </Fragment>
    );
  }
}
