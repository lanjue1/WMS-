import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker, Spin, Tabs, Collapse, Select } from 'antd';
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
import EditPage from '@/components/EditPage';
import DetailsList from '@/components/DetailsList'
import AntdForm from '@/components/AntdForm';
import AntdInput from '@/components/AntdInput'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import { transferLanguage, columnConfiguration } from '@/utils/utils'
import SearchSelect from '@/components/SearchSelect';
import styles from '@/pages/Operate.less';
import prompt from '@/components/Prompt';
import { formItemFragement, allDictList } from '@/utils/common';
import { queryFileList, filterAddFile, filterDeteteFile } from '@/utils/common';
import AddDetailsModal from './components/AddDetailsModal'
import BaseInfoForm from './components/BaseInfoForm'
import TrainingForm from './components/TrainingForm'
import CustomsForm from './components/CustomsForm'

import {
	allDispatchType,
	codes,
	formType,
	currencyData,
	columnsParts,
	columnsPackage,
	columnsBill,
} from './utils';
import { returnAtIndex } from 'lodash-decorators/utils';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;
const { TabPane } = Tabs;
const { Panel } = Collapse
const { TextArea } = Input

@connect(({ so, loading, i18n }) => ({
	loading: loading.effects[allDispatchType.detail],
	language: i18n.language,
	soDetails: so.soDetails,
	soDetailList: so.soDetailList
}))
@Form.create()

export default class PoDetail extends Component {
	className = 'PoDetail'
	state = {
		disabled: true,
		key: 1,
		key2: 1,
		activeKey: ['1', '2', '3'],
		expandForm: false,
		detailId: '',
		whichForm: '',
		allFormParams: {},
		_columnsParts: [],
		_columnsPackage: [],
		_columnsBill: [],
		checkIds: [],
		selectModalDetail: undefined,
		selectedRowsParts: [],
		// selectedRowsPackage:[],
		selectedRowsBill: [],
		visible: false
	}
	componentDidMount() {
		const { match: {
			params: { id },
			path,
		}, form, dispatch } = this.props;
		columnsParts.map((item) => {
			if (item.dataIndex === 'lineNo') {
				item.render = (text, record) => {
					return <a onClick={() => {
						this.setState({
							selectModalDetail: record,
							visible: true
						})
					}} >{text}</a>
				}
			}
		})
		this.setState({
			_columnsParts: columnConfiguration(columnsParts, '_columnsParts'),
			// _columnsPackage: columnConfiguration(columnsParts, '_columnsPackage'),
			// _columnsBill: columnConfiguration(columnsParts, '_columnsBill'),
		})
		if (!id) {
			this.setState({
				disabled: false,
			})
			return
		}
		this.setState({
			detailId: id,
		}, () => {
			this.getDetail()
			this.getDetailList({ type: 'soDetailList' })
		});


	}

	toggleForm = () => {
		const { expandForm } = this.state;
		this.setState({
			expandForm: !expandForm,
		});
	};
	tabsChange = (key) => {
		this.setState({ key, whichForm: formType[key - 1] })
	}
	tabsChange2 = (key) => {
		this.setState({ key2: key })
	}
	callback = key => {
		this.setState({
			activeKey: key,
		});
	};

	getDetailList = (params = {}) => {
		const { type, ...param } = params
		const { dispatch } = this.props
		const { detailId } = this.state
		param.soId = detailId
		dispatch({
			type: 'so/soDetailList',
			payload: { type, ...param },
		})
	}
	getDetail = () => {
		const { dispatch } = this.props
		const { detailId } = this.state
		dispatch({
			type: 'so/soDetails',
			payload: { id: detailId },
		})
	}
	handleFormReset = () => {
		const { form, } = this.props
		this.setState({
			formValues: {},
		});
		form.resetFields();
		this.getDetailList({ type: 'soDetailList' })
	};
	handleSearch = formValues => {
		const { ...value } = formValues
		this.getDetailList({ ...value, type: 'soDetailList' })
		this.setState({ formValues: value })
	};
	handleFormResetPackage = () => {
		const { form, } = this.props
		this.setState({
			formValuesPackage: {},
		});
		form.resetFields();
		this.getDetailList({ type: 'package' })
	};
	handleSearchPackage = formValues => {
		const { ...value } = formValues
		this.getDetailList({ value, type: 'package' })
		this.setState({ formValuesPackage: value })
	};
	// 选中行
	handleSelectRows = (rows, type) => {
		const selectRows = {
			bill: 'selectedRowsBill',
			parts: 'selectedRowsParts'
		}
		let ids = [];
		if (Array.isArray(rows) && rows.length > 0) {
			rows.map((item, i) => {
				ids.push(item.id);
			});
		}
		this.setState({
			[selectRows[type]]: rows,
			checkIds: ids,
		});

	};
	handleStandardTableChange = (param, type) => {
		const { formValues, formValuesPackage } = this.state;
		switch (type) {
			case 'soDetailList':
				this.getDetailList({ ...formValues, type })
				break;
		}
	}

	onRef = (ref, type) => {
		this.setState({ whichForm: type })
		switch (type) {
			case 'BaseInfo':
				this.childBase = ref;
				break;
			case 'Traning':
				this.childTrain = ref;
				break;
			case 'Customs':
				this.childCustoms = ref;
				break;
		}
	}

	getValue = (values, type) => {
		// console.log('getValue', values, type)
		this.setState({
			[type]: values
		})
		if (type === 'currency') {
			//币种切换重新调取详情接口
		}

	}
	ableOperate = (type, status) => {
		const { dispatch } = this.props
		const { detailId, checkIds } = this.state
		const params = {
			type,
			id: detailId
		}
		if (status) {
			params.ids = [detailId]
			delete params.id
		}
		if (type === 'soDetailDelete') {
			params.ids = checkIds
		}
		if (type === 'soDetailAdd') {
			this.setState({
				visible: true
			})
			return
		}
		dispatch({
			type: 'so/ableOperate',
			payload: params,
			callback: res => {
				this.getDetailList({ type: 'soDetailList' })
			}
		})
	}

	saveInfo = () => {
		const { soDetails = {}, dispatch } = this.props
		const { detailId, allFormParams } = this.state
		const params = {}
		const formList = [
			this.childBase,
			this.childTrain,
			this.childCustoms
		]
		let flag = true
		let newParams = {}
		formList.map((item, index) => {
			if (index !== 2) {
				if (!item) {
					flag = false
					return
				}
				item.props.form.validateFieldsAndScroll((err, values) => {
					if (err) {
						flag = false
						return
					}
					newParams = { ...newParams, ...values }
				})
			}
		})
		if (!flag) {
			prompt({
				content: `请检查必填项`,
				title: '提示',
				duration: 100,
				type: 'error',
			})
			return
		}
		const { customerId, actualAmount, loadingTime, arrivedTime, declareTime, declarationCompletionTime, bizDate, estimateReceiveTime, realReceiveTimeStart, realReceiveTimeEnd } = newParams

		// 处理远程下拉
		customerId.length > 0 ? newParams.customerId = customerId[0].id : newParams.customerId = undefined

		// 处理时间
		let obj = { actualAmount, loadingTime, arrivedTime, declareTime, declarationCompletionTime, bizDate, estimateReceiveTime, realReceiveTimeStart, realReceiveTimeEnd }
		Object.keys(obj).map((field) => {
			return {
				field,
				value: obj[field] || undefined
			}
		}).map(item => {
			item.value ? newParams[item.field] = moment(newParams[item.field]).format(dateFormat) : ''
		})

		//  处理附件
		const _fileToken = soDetails[detailId] && soDetails[detailId].fileToken || []
		const _signForm = soDetails[detailId] && soDetails[detailId].signForm || []

		const fileInfo = []
		let FileToken = newParams.fileToken
		let SignForm = newParams.signForm
		if (FileToken && FileToken.length > 0) {
			fileInfo.push({
				fileBizType: 'poBaseInfo',
				fieldName: 'fileToken',
				fileTokens: filterAddFile(FileToken),
				deleteFileIds: filterDeteteFile(FileToken, _fileToken)
			})
			//清空附件字段
			newParams.fileToken = ''
		}
		if (SignForm && SignForm.length > 0) {
			fileInfo.push({
				fileBizType: 'PoSignForm',
				fieldName: 'signForm',
				fileTokens: filterAddFile(SignForm),
				deleteFileIds: filterDeteteFile(SignForm, _signForm)
			})
			newParams.signForm = ''
		}
		newParams.fileInfo = fileInfo
		detailId ? newParams.id = detailId : ''
		dispatch({
			type: 'so/ableOperate',
			payload: { ...newParams, type: detailId ? 'update' : 'add' },
			callback: (data) => {
				if (detailId) {
					this.setState(preState => ({
						disabled: !preState.disabled,
					}));
					this.getDetail()
				} else {
					dispatch({
						type: 'common/setTabsName',
						payload: {
							id: data.data,
							isReplaceTab: true,
						}
					})
					router.push(`/outboundManagement/WmsSoDetailEditPage/edit/${data.data}`);
				}
			}
		})
	}

	onCancel = () => {
		this.setState({
			visible: false,
			selectModalDetail: undefined
		})
	}

	extraCur = () => {
		return <div onClick={(event) => event.stopPropagation()}>
			<label style={{ width: '80px', marginRight: '15px' }}>货值币种</label>
			<AdSelect payload={{ code: allDictList.currency }} style={{ width: '150px' }}
				onChange={(values) => this.getValue(values, 'currency')} />
		</div>
	}
	render() {
		const { detail, soDetails, match: { params }, form, soDetailList
		} = this.props
		const {
			visible,
			disabled,
			expandForm,
			selectedRowsParts,
			// selectedRowsPackage:[],
			selectedRowsBill,
			detailId,
			selectModalDetail
		} = this.state
		const currentId = params && params.id;
		let selectDetails = currentId && soDetails[currentId] || {};
		const commonParams = { getFieldDecorator: form.getFieldDecorator }
		const firstFormItem = (
			<AntdFormItem label={'明细单号'} code="lineNo" {...commonParams}>
				<TextArea rows={1} />
			</AntdFormItem>
		);
		const secondFormItem = (
			<AntdFormItem label={'料号'} code="partNo" {...commonParams}>
				<TextArea rows={1} />
			</AntdFormItem>
		);
		const otherFormItem = [
			[
				<AntdFormItem label={'状态'} code="statusParts" {...commonParams}>
					<AdSelect payload={{ code: allDictList.Buy_Ledger_OrderType }} />
				</AntdFormItem>,
			],
			['operatorButtons'],
		];
		const selectFormParts = {
			firstFormItem,
			secondFormItem,
			otherFormItem,
			form,
			className: this.className,
			handleFormReset: this.handleFormReset,
			handleSearch: this.handleSearch,
			toggleForm: this.toggleForm,
			quickQuery: true
		}
		const firstFormItemPackage = (
			<AntdFormItem label={'箱号'} code="containerNo" {...commonParams}>
				<AntdInput type='textarea' />
			</AntdFormItem>
		);
		const secondFormItemPackage = (
			<AntdFormItem label={'板号'} code="palletNo" {...commonParams}>
				<TextArea rows={1} />
			</AntdFormItem>
		);
		const otherFormItemPackage = [
			[
				<AntdFormItem label={'状态'} code="statusPackage" {...commonParams}>
					<AdSelect payload={{ code: allDictList.Buy_Ledger_OrderType }} />
				</AntdFormItem>,
			],
			[
				<AntdFormItem label={'单号'} code="poNo" {...commonParams}>
					<TextArea rows={1} />
				</AntdFormItem>,
				<AntdFormItem label={'料号'} code="partNo" {...commonParams}>
					<TextArea rows={1} />
				</AntdFormItem>,

			],

			['operatorButtons'],
		];
		const selectFormPackage = {
			firstFormItem: firstFormItemPackage,
			secondFormItem: secondFormItemPackage,
			otherFormItem: otherFormItemPackage,
			form,
			className: this.className,
			handleFormReset: this.handleFormResetPackage,
			handleSearch: this.handleSearchPackage,
			toggleForm: this.toggleForm,
			quickQuery: true
		}
		const fields = [
			{ key1: 'planPcsQty', key2: 'actualPcsQty', name: '预计 | 实际PCS', isContrast: true },
			{ key1: 'planInnerQty', key2: 'actualInnerQty', name: '预计 | 实际内包装', isContrast: true },
			{ key1: 'planPalletQty', key2: 'actualPalletQty', name: '预计 | 实际板数', isContrast: true },
			{ key1: 'planBoxQty', key2: 'actualBoxQty', name: '预计 | 实际箱数', isContrast: true },
			{ key1: 'planGrossWeight', key2: 'actualGrossWeight', name: '预计 | 实际毛重(kg)', isContrast: true },
			{ key1: 'planNetWeight', key2: 'actualNetWeight', name: '预计 | 实际净重(kg)', isContrast: true },
			{ key1: 'planVolume', key2: 'actualVolume', name: '预计 | 实际体积', isContrast: true },
			{ key1: 'planCargoValue', key2: 'actualCargoValue', name: '预计 | 实际货值', isContrast: true },
		]
		const generateButton = (
			<Button.Group>
				{disabled && <><AdButton text='取消订单' onClick={() => this.ableOperate('cancelOrder', true)} />
					<AdButton text='取消受理' onClick={() => this.ableOperate('cancelAccepted', true)} />
					<AdButton text='受理确认' onClick={() => this.ableOperate('confirmAccepted', true)} /></>}
				{
					disabled ? <AdButton text='编辑' onClick={() => this.setState({ disabled: false })} />
						:
						(
							<>
								<AdButton type='primary' text='保存' disabled={disabled} onClick={() => this.saveInfo()} />
								{currentId && <AdButton text='取消' onClick={() => this.setState({ disabled: true })} />}
							</>
						)
				}
			</Button.Group>
		)
		const genExtraBasicInfo = () => {
			return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
				{detailId ? <span>SO详情</span> : <span>SOAdd</span>}
				{generateButton}
			</div>
		}
		const tableButtonsBill = {
			buttons: (
				<Button.Group>
					<AdButton text={'修改'} onClick={() => this.ableOperate('billEdit')} />
					<AdButton text={'删除'} onClick={() => this.ableOperate('billDelete')} />
					<AdButton text={'重新计费'} onClick={() => this.ableOperate('billReCharge')} />
				</Button.Group>
			),
			rightButtons: (
				<Button.Group>
					<AdButton type='primary' text={'新增费用'} onClick={() => this.ableOperate('billAdd')} />

				</Button.Group>
			),
		}
		const partsButtons = (<Button.Group>
			<AdButton text={'删除'} onClick={() => this.ableOperate('soDetailDelete')} />
			<AdButton text={'添加'} onClick={() => this.ableOperate('soDetailAdd')} />
		</Button.Group>)
		const panelValue = [
			{ title: '基础信息' },
			{ title: '货物信息' },
			{ title: '明细信息' },
		]
		const firstTabs = [
			{ title: '基本信息' },
			{ title: '运输信息' },
			{ title: '关务信息' },
			{ title: '拓展信息' },
		]
		const customPanelStyle = {
			borderRadius: 4,
			marginBottom: 12,
			border: 0,
			overflow: 'hidden',
		};
		return (
			<div className={styles.CollapseUpdate}>
				<PageHeaderWrapper title={genExtraBasicInfo()} >
					<Collapse activeKey={this.state.activeKey} bordered={false} onChange={key => this.callback(key)}>
						<Panel header={panelValue[0].title} key='1' style={customPanelStyle} >
							<div className={styles.tableListForm}>
								<Tabs defaultActiveKey='1' onChange={this.tabsChange} tabBarStyle={{ marginBottom: '10px' }}>
									<TabPane tab={firstTabs[0].title} key='1'>
										<BaseInfoForm selectDetails={selectDetails} disabled={disabled} onRef={(ref) => this.onRef(ref, formType[0])} />
									</TabPane>
									<TabPane tab={firstTabs[1].title} key='2'>
										<TrainingForm selectDetails={selectDetails} disabled={disabled} onRef={(ref) => this.onRef(ref, formType[1])} />
									</TabPane>
									<TabPane tab={firstTabs[2].title} key='3'>
										<CustomsForm selectDetails={selectDetails} disabled={disabled} onRef={(ref) => this.onRef(ref, formType[2])} />
									</TabPane>
								</Tabs>
							</div>
						</Panel>
						{currentId && <Panel header={panelValue[1].title} key='2' style={customPanelStyle} extra={this.extraCur()}>
							<DetailsList isThree detilsData={{ fields: fields, value: selectDetails }} />
						</Panel>}
						{currentId && <Panel header={panelValue[2].title} key='3' extra={partsButtons} style={customPanelStyle} >
							<SelectForm {...selectFormParts} />
							<StandardTable
								selectedRows={selectedRowsParts}
								onSelectRow={(rows) => this.handleSelectRows(rows, 'parts')}
								data={soDetailList[detailId] || {}}
								columns={this.state._columnsParts}
								onPaginationChange={(params) => this.handleStandardTableChange(params, 'parts')}
								expandForm={expandForm}
								className={this.className}
							// disabledRowSelected={true}
							/>
						</Panel>}
					</Collapse>
					<AddDetailsModal detail={selectDetails} refreshList={() => this.getDetailList({ type: 'soDetailList' })} selectDetails={selectModalDetail} onCancel={this.onCancel} visible={visible} />
				</PageHeaderWrapper>
			</div>
		)
	}
}