import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Icon, Modal, Upload, Button, Form, Select, Collapse } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import reqwest from 'reqwest';
import prompt from '@/components/Prompt';
import { transferLanguage } from '@/utils/utils';
import AutoForm from './AutoForm'
import AutoList from '../AutoList'
import AntdForm from '@/components/AntdForm';

const Panel = Collapse.Panel;
const confirm = Modal.confirm;
@connect(({ component, i18n, autoPage }) => ({
	component,
	language: i18n.language,
	pageConfig: autoPage.operatePageConfigData,
}))
// @Form.create()
export default class FileImport extends Component {
	static propTypes = {
		visible: PropTypes.bool,
		urlImport: PropTypes.string,
		urlQuery: PropTypes.array,
		accept: PropTypes.string,
		queryData: PropTypes.array,
	};

	static defaultProps = {
		visible: false,
		urlImport: '',
		urlQuery: [],
		queryData: [],
		accept: '',
	};

	constructor(props) {
		super(props);
		this.state = {
			fileList: [],
			uploading: false,
			noPageConfig: false,
			pageLoadding: true,
			activeKey: [0, 1],
			selectDetails: {},
			objParams: {},//远程下拉框关联传递参数 
			isWayBill: false,
			newCardLayout: [],
			formList: [],
			cardLayoutList:[]


		};
	}
	pageCode = this.props.pagecode
	pageId = this.props?.match?.params?.id

	componentDidMount() {
		const {
			dispatch,
			pageConfig,
		} = this.props;
		if (!pageConfig[this.pageCode]) {
			this.getPageConfig()
		} else {
			let editLayout = pageConfig[this.pageCode]?.editLayout;
			let requestUrl = editLayout?.requestUrl;
			this.getPopupDetails(requestUrl)
		}

	}
	//获取弹出框详情
	getPopupDetails = (requestUrl) => {
		const {
			dispatch,
			pageConfig,
			modalParamVal
		} = this.props;

		if (modalParamVal && modalParamVal.length == 1 && requestUrl) {
			//list页面 弹出调用详情 回显  只能是单选情况  多选不调用详情
			let id = modalParamVal[0];
			// this.setState({ detailId: id });
			dispatch({
				type: 'autoPage/selectDetails',
				payload: { id, requestUrl: requestUrl },
				callback: data => {
					let editLayout = pageConfig[this.pageCode]?.editLayout;
					let moduleList = editLayout?.cardLayout[0]?.moduleList;
					let objParams = {};
					moduleList.forEach((item, index) => {
						if (item.params && item.params.length > 0) {
							item.params.forEach((citem, cindex) => {
								if (citem.type == "VAR") {
									objParams[citem.key] = data[citem.key]
								} else if (citem.type == "CONS") {
									objParams[citem.key] = citem.value;
								}

							})
						}
					})
					this.setState({
						selectDetails: data,
						objParams: objParams
					})

					// const { formList } = this.props
					// formList.forEach((item) => {
					//   if (!item.hidden && ['enum'].indexOf(item.type) === -1) {
					//     if (item.type === 'attachment') {
					//       this._queryFileList(item, id)
					//     }
					//   }
					// })
				},
			});
		}

	}
	getPageConfig = () => {
		this.setState({
			pageLoadding: true
		})
		const { dispatch } = this.props
		dispatch({
			type: 'autoPage/getOperatePageConfig',
			payload: {
				id: this.pageCode
			},
			callback: (data) => {
				if (data.code === 0) {
					let requestUrl = data?.data?.editLayout?.requestUrl;
					this.getPopupDetails(requestUrl)
					this.setState({
						activeKey: Array.from({ length: pageConfig[this.pageCode]?.editLayout.cardLayout.length }, (v, k) => k)
					})
				} else {
					this.setState({
						noPageConfig: true
					})
				}
				this.setState({
					pageLoadding: false
				})
			}
		})
	}
	// 获取子组件
	onRef = (ref) => {
		let { formList } = this.state
		formList.push(ref)
		this.setState({
			formList: formList
		})
	}
	handleUpload = (data) => {
		const { fileList, formList } = this.state;
		const { pageConfigData, pageConfig, queryData, downloadFile, callData, importPayload, form, dispatch, refreshPage, modalParamName, modalParamVal } = this.props;
		let cardLayout = pageConfig[this.pageCode]?.editLayout?.cardLayout;
		let revision;
		let revisionId;
		if (cardLayout && cardLayout[0] && cardLayout[0].revision) {
			revision = cardLayout[0].revision;
			revisionId= cardLayout[0].revisionId;
		}
		if (revision) {
			//针对弹出动态添加多表单的
			let arrVal = [];
			formList.forEach((item, index) => {
				item.props.form.validateFieldsAndScroll((err, values) => {
					if (err) return;
					values = this.setOperate(values)
					//多条数据数据提交开始 有待后端配合 数据提交接口咱没有对接   
					arrVal.push(values.values);
					//多条数据数据提交结束
					if (modalParamVal && modalParamVal.length) {
						//弹出页面关联列表的选中id
						values.values[modalParamName] = modalParamVal;
					}
				})
			})
			dispatch({
				type: 'autoPage/saveFormData',
				payload: { [revisionId]:arrVal, requestUrl: data.requestUrl },
				callback: (data) => {
					refreshPage()
				}
			});
			this.handleCancel();
		} else {
			formList.forEach((item, index) => {
				item.props.form.validateFieldsAndScroll((err, values) => {
					if (err) return;
					values = this.setOperate(values)
					//多条数据数据提交结束
					if (modalParamVal && modalParamVal.length) {
						//弹出页面关联列表的选中id
						values.values[modalParamName] = modalParamVal;
					}
					if ((values.isUpload && fileList.length === 0) || (!values.isUpload && values.values.hasOwnProperty("headThumb") && !values.values.headThumb)) {
						prompt({ content: '请先上传文件', type: 'error' });
						return
					}
					if (values.isUpload) {
						reqwest({
							url: `/server/api/${data.requestUrl}`,
							method: 'post',
							processData: false,
							data: values.values,
							headers: {
								token: localStorage.getItem('token'),
							},
							contentType: 'multipart/form-data',
							success: res => {
								// const { code, message } = res;
								this.setState({
									uploading: false,
								});
								if (res && res.code == 0) {
									this.setState({
										fileList: [],
									});
									refreshPage()
									this.handleCancel();
									prompt({ content: 'Success' });
								} else {
									prompt({ content: res?.message, type: 'error' });
								}
							},
							error: () => {
								this.setState({
									uploading: false,
								});
								this.handleCancel();
								prompt({ content: 'Failed', type: 'error' });
							},
						});
					} else {
						dispatch({
							type: 'autoPage/saveFormData',
							payload: { ...values.values, requestUrl: data.requestUrl },
							callback: (data) => {
								refreshPage()
							}
						});
						this.handleCancel();
					}
				})
			})
		}

	};

	setOperate = (values) => {
		let isUpload = false
		const formData = new FormData();
		const { pageConfig, paramVal } = this.props
		//advanceLayout 页面弹出框传递对用页面id
		if (paramVal) {
			values['parentId'] = paramVal;
		}
		let formItem = pageConfig[this.pageCode]?.editLayout.cardLayout?.map((item, index) => {
			if (item.type === 'EDIT' && item.moduleList.length > 0) {
				item.moduleList.map(v => {
					if (!values[v.dataIndex]) {
						return
					}
					if (v.type == "fileImport") {
						isUpload = true
						this.state.fileList.forEach(file => {
							formData.append('file', file);
						});
						delete values[v.dataIndex]
					}
					// 处理下来类型callselect 传值给后台对应id值
					// if (v.type == "callselect") {
					// 	values[v.dataIndex] = values[v.dataIndex][0].id;
					// }

					switch (v.type) {
						case 'date':
							values[v.dataIndex] = moment(values[v.dataIndex]).format(v.format)
							break;
						case 'dateRange':
							values[v.param1] = moment(values[v.dataIndex][0]).format(v.format)
							values[v.param2] = moment(values[v.dataIndex][1]).format(v.format)
							delete values[v.dataIndex]
							break;
						case 'callSelect':
							values[v.dataIndex] = values[v.dataIndex][0].id
							break;

						default:
							break;
					}
				})
			}
		})
		if (isUpload) {
			for (const key in values) {
				if (values.hasOwnProperty(key)) {
					formData.append(key, values[key]);
				}
			}

		}
		return {
			isUpload,
			values: isUpload ? formData : values
		}


	}

	dispatchFun = url => {
		const { dispatch } = this.props;
		if (Array.isArray(url) && url.length > 0) {
			url.map(v => {
				v &&
					dispatch({
						type: 'component/queryComponentList',
						payload: { params: v.payload, url: v.url },
					});
			});
		}
	};
	query = val => {
		const { dispatch } = this.props;
		if (Array.isArray(val) && val.length > 0) {
			val.map(fun => {
				fun();
			});
		}
	};

	handleCancel = () => {
		const { handleCancel } = this.props;
		this.setState({
			fileList: [],
		});
		handleCancel();
	};

	callback = key => {
		this.setState({
			activeKey: key,
		});
	};
	setFooter = () => {
		const { modalOpen, pageConfig ,language} = this.props
		let footer = [
			<Button key="back" onClick={this.handleCancel}>
				{transferLanguage('Common.field.cancel', language)}
			</Button>
		]
		pageConfig[this.pageCode]?.editLayout.buttons.map(item => {
			const button = <Button key={item.id} type="primary" onClick={() => this.handleUpload(item)} >{transferLanguage(item.title,language)}</Button>
			if (item.operType === 'ADD' && modalOpen === 'ADD') {
				footer.push(button)
			}
			if (item.operType === 'EDIT' && modalOpen === 'EDIT') {
				footer.push(button)
			}
		})

		return footer
	}
	addForm() {
		const { modalOpen, pageConfig } = this.props
		const { newCardLayout } = this.state
		let cardLayout = pageConfig[this.pageCode]?.editLayout?.cardLayout;
		let obj = cardLayout[0];
		let maxCount = obj?.maxCount;
		if (newCardLayout.length >= maxCount - 1) {
			prompt({
				content: `超出新增限制了`,
				type: 'error',
			});
			return false;
		}
		this.state.newCardLayout.push(cardLayout[0])
		this.setState({
			newCardLayout: this.state.newCardLayout
		})

	}
	minusForm() {
		const { newCardLayout,formList} = this.state;
		if (newCardLayout.length <= 0) {
			prompt({
				content: `不能删除了`,
				type: 'error',
			});
		} else {
			newCardLayout.pop();
			formList.pop();
			this.setState({
				newCardLayout: newCardLayout,
				formList:formList
			})
		}

	}
	downLoadFn(requestUrl, key, value) {
		const { dispatch } = this.props;
		dispatch({
			type: 'autoPage/downLoadFn',
			payload: {
				key: key,
				value: value,
				requestUrl: requestUrl
			},
			callback: (data) => {
			}
		});
	}
	render() {
		const { visible, modalOpen, modalTitle, urlCase, urlCase2, accept, extra, language, pageConfig } = this.props;
		const { uploading, fileList, fileList2, selectDetails, objParams, isWayBill, newCardLayout,cardLayoutList } = this.state;
		let detail = selectDetails;
		let title = pageConfig[this.pageCode]?.editLayout?.title;
		let cardLayout = pageConfig[this.pageCode]?.editLayout?.cardLayout;
		let revision;
		let newCardLayoutFlag = [];
		if (cardLayout && cardLayout[0] && cardLayout[0].revision && modalOpen == 'ADD') {
			//生成运单 isWayBillFlag
			revision = cardLayout[0].revision;
			cardLayout = [];
			if (newCardLayout && newCardLayout.length > 0) {
				cardLayout = [pageConfig[this.pageCode]?.editLayout?.cardLayout[0], ...newCardLayout];
			} else {
				cardLayout = [pageConfig[this.pageCode]?.editLayout?.cardLayout[0]];
			}

		} else {
			revision = isWayBill;
			cardLayout = pageConfig[this.pageCode]?.editLayout?.cardLayout;

		}
		const propsFile = {
			onRemove: file => {
				this.setState(state => {
					const index = state.fileList.indexOf(file);
					const newFileList = state.fileList.slice();
					newFileList.splice(index, 1);
					return {
						fileList: newFileList,
					};
				});
			},
			beforeUpload: file => {
				if (accept) {
					const name = file.name;
					const fileext = name ? name.substring(name.lastIndexOf('.'), name.length) : '';
					if (accept.indexOf(fileext) != -1) {
						this.setState(state => ({
							fileList: [file],
						}));
					} else {
						prompt({
							content: `上传的文件格式不对，支持后缀为：${accept} 的文件格式上传，请重新选择`,
							type: 'error',
						});
					}
				} else {
					this.setState(state => ({
						fileList: [...state.fileList, file],
					}));
				}
				return false;
			},
			fileList,
			accept,
		};
		const customPanelStyle = {
			borderRadius: 4,
			marginBottom: 12,
			border: 0,
			overflow: 'hidden',
		};
		// title={transferLanguage('Modal.field.importData', language)}
		return (
			<Fragment>
				{visible && (
					<Modal
						title={transferLanguage(modalTitle, language)}
						visible={visible}
						// onOk={this.handleUpload}
						onCancel={this.handleCancel}
						footer={this.setFooter()}
						width={860}
						style={{ top: 20 }}
						destroyOnClose={true}
						confirmLoading={uploading}
					// cancelText={transferLanguage('Common.field.cancel', language)}
					// okText={transferLanguage('Common.field.ok', language)}
					>
						<AntdForm>
							<Collapse
								style={{ background: '#fff' }}
								activeKey={this.state.activeKey}
								onChange={key => this.callback(key)}
								bordered={false}
							>
								{
									cardLayout?.map((item, index) => {
										return (<Panel header={transferLanguage(item.title, language)} key={index} style={customPanelStyle}>
											{item.type === 'EDIT' && <AutoForm onRef={this.onRef} objParams={objParams} detail={detail} disabled={false} postFileList={(fileList) => this.setState({ fileList })} formList={item.moduleList} />}
											{item.type === 'EDIT' && item.link && <a href={`http://${window.location.host}/server/api/${item.link.requestUrl}?${item.link.param.param[0].key + '=' + item.link.param.param[0].value}&token=${localStorage.getItem('token')}`} download>
												{ item.link&&transferLanguage(item.link.title, language)}
											</a>}
											{/* {item.type === 'EDIT' && item.link && <a icon="download" onClick={() => { this.downLoadFn(item.link.requestUrl, item.link.param.param[0].key, item.link.param.param[0].value, localStorage.getItem('token')) }}> {item.link.title}</a>} */}
											{item.type === 'LIST' && <AutoList pageData={item} />}
										</Panel>)
									})
								}
							</Collapse>
						</AntdForm>
						{revision ? <div>
							<Icon type="plus-circle" style={{ fontSize: '25px', marginRight: '30px' }} onClick={() => { this.addForm() }} />
							<Icon type="delete" style={{ fontSize: '25px' }} onClick={() => { this.minusForm() }} />
						</div> : ''}
						{/* {extra && <div>{extra}</div>} */}

						{/* {urlCase && (
							<div style={{ marginBottom: 16 }}>
								<a href={`https://${window.location.host}/server/api/${urlCase}${urlCase.indexOf('?') === -1 ? '?' : '&'}token=${localStorage.getItem('token')}`} download>
									{transferLanguage('Modal.field.downForm', language)}
								</a>
                &nbsp;&nbsp;&nbsp;
								{urlCase2 && (
									<a href={`https://${window.location.host}/server/api/${urlCase2}${urlCase.indexOf('?') === -1 ? '?' : '&'}token=${localStorage.getItem('token')}`} download>
										{transferLanguage('Modal.field.downForm', language)}
									</a>
								)}
							</div>
						)
						} */}
						{/* <Upload {...propsFile}>
							<Button>
								<Icon type="upload" />{transferLanguage('Modal.field.envelope', language)}
							</Button>
						</Upload> */}

						{/* {accept && (
							<p style={{ color: 'red', marginTop: 12, marginbottom: 0 }}>
								// （提示：支持 {accept} 格式文件） 
								{" ( " + transferLanguage('Modal.field.fileFormats', language) + " : " + accept + " ) "}
							</p>
						)} */}
					</Modal >
				)}
			</Fragment >
		);
	}
}
