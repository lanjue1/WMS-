import React, { Component } from 'react';
import { Col, DatePicker, Form, Input, Row, Select, InputNumber, Badge, Upload, Button, Icon } from 'antd';
import moment from 'moment';
import { editCol, editGutter, editRow, allDictList } from '@/utils/constans';
import { connect } from 'dva';
import AdModal from '@/components/AdModal';
import SearchSelect from '@/components/SearchSelect';
import styles from '@/pages/Operate.less';
import { conditionList } from '../utils'
import AntdFormItem from '@/components/AntdFormItem';
import AdInput from '@/components/AdInput';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import AntdInput from '@/components/AntdInput';
import AntdDatePicker from '@/components/AntdDatePicker';
import FileReader from '@/components/FileReader';
import { queryFileList, filterAddFile, filterDeteteFile } from '@/utils/common';
import { transferLanguage } from '@/utils/utils';


const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@Form.create()
@connect(({ component, i18n }) => ({
    ownCompany: component.ownCompany,
    dictObject: component.dictObject,
    language: i18n.language
}))
export default class AutoForm extends Component {
    state = {
        formItem: [],
        disabled: this.props.disabled,
        fileList: [],
        // 获取需要清空的下拉框
        formListEmpty: this.props.formList ? this.formListEmptyChang() : []
    }

    componentDidMount() {
        const { formList } = this.props;
        this.props.onRef(this)
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.disabled !== nextProps.disabled) {
            this.setState({ disabled: nextProps.disabled })
        }
    }
    // 获取想要的重组formList
    formListEmptyChang() {
        let { formList } = this.props
        let empty = []
        formList.forEach((item) => {
            if (item.type == 'callSelect') {
                if (item.childrens) {
                    item.childrens.forEach((i) => {
                        empty.push({
                            id: i.id,
                            value: {},
                            type: 0
                        })
                    })

                }
            }
        })
        return empty
    }
    convertFormFormat = (formList) => {
        const { form: { getFieldDecorator }, detail,language} = this.props
        // console.log('detail',detail)
        const commonParams = {
            getFieldDecorator,
        };
        let formItem = []
        let itemArr = []
        formList.map((item, index) => {
            if (!item.hidden) {
                //!item.hidden && ['enum'].indexOf(item.type) === -1
                // if(item.type=='attachment'){console.log('detail[item.dataIndex]',detail[item.dataIndex])}
                let component;
                if (item.type == "date") {
                    component = (<AntdFormItem
                        label={transferLanguage(item.title, language)}
                        code={item.dataIndex}
                        rules={[{ required: item.required ,message:item.verify}]}
                        initialValue={
                            detail&&detail[item.dataIndex] ?moment(detail[item.dataIndex], item.format)  : null}
                        // detail ?  detail[item.dataIndex] : undefined}
                        {...commonParams}
                    >
                        {this.switchFormComponent(item)}
                    </AntdFormItem>)
                } else {
                    component = (<AntdFormItem
                        label={transferLanguage(item.title, language)}
                        code={item.dataIndex}
                        rules={[{ required: item.required ,message:item.verify}]}
                        initialValue={
                            detail ? typeof detail[item.dataIndex] === 'boolean' ? String(detail[item.dataIndex]) : detail[item.dataIndex] : null}
                        // detail ?  detail[item.dataIndex] : undefined}
                        {...commonParams}
                    >
                        {this.switchFormComponent(item)}
                    </AntdFormItem>)
                }

                let obj = {
                    component: component,
                    span: item.span
                }
                formItem.push(obj)

                // itemArr.push(component)
                // if (formList.length - 1 !== index) {
                //     if (itemArr.length === 2) {
                //         formItem.push(itemArr)
                //         itemArr = []
                //     }
                // } else {
                //     if (itemArr.length > 0) {
                //         formItem.push(itemArr)
                //     } else {
                //         formItem.push([component])
                //     }
                // }
            }
        })
        return formItem

    }

    onRemove = file => {
        const { postFileList } = this.props
        this.setState(state => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
                fileList: newFileList,
            };
        }, () => {
            postFileList(this.state.fileList)
        });
    }

    beforeUpload = (file, accept) => {
        const { postFileList } = this.props
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
            }), () => {
                postFileList(this.state.fileList)
            });
        }

        return false;
    }

    onChange = (val, type, value) => {
        if (type == 1) {
            return
        }
        let { formListEmpty } = this.state
        // 判断是否有childrens
        if (value.childrens && value.childrens.length) {
            const { form } = this.props
            let childrents = []
            value.childrens.forEach((item) => {
                childrents.push(item.id)
                formListEmpty.forEach((i) => {
                    if (item.id == i.id) {
                        if (val) {
                            i.value[value.dataIndex] = val[0].id
                            i.type = 1
                        }

                    }
                })
            })
            this.setState({
                formListEmpty: formListEmpty
            })
            form.resetFields(childrents);
        } else {
            formListEmpty.forEach((i) => {
                if (val && (i.id == value.dataIndex)) {
                    i.type = 0
                }
            })
            this.setState({
                formListEmpty: formListEmpty
            })
            return
        }
    }
    // 判断清空的参数
    emptyChang = (val) => {
        let { formListEmpty } = this.state
        let empty = {}
        formListEmpty.forEach((item) => {
            if (item.type == 1 && item.id == val) {
                empty = item.value
            }
        })

        return empty
    }

    switchFormComponent = (value) => {
        const { dictObject, detail, currentId, language,objParams } = this.props
        const { disabled, fileList } = this.state
        let component = <AntdInput disabled={value.readyOnly ? true : disabled} readyOnly={value.readyOnly } />
        //   if(JSON.stringify(detail) != "{}"){
        //   }
        switch (value.type) {
            case 'text':
                component = <AntdInput disabled={value.readyOnly ? true : disabled} readyOnly={value.readyOnly } maxLength={value.maxLength?value.maxLength:20}/>
                break;
            case 'enum':
                component = <AdSelect
                    dataCode={detail[`${value.dataIndex}`]}
                    dataName={detail[`${value.dataIndex}_showName`]}
                    disabled={value.readyOnly ? true : disabled}
                    data={dictObject[value.enumCode]}
                    payload={{ code: value.enumCode }}
                    show={{ id: 'value', name: 'code' }}
                    value={String(detail[value.dataIndex])}
                />
                break;
            case 'date':
                component = <AntdDatePicker defaultValue={moment(detail[`${value.dataIndex}`], value.format)} format={value.format} showTime={value.format.indexOf('HH:mm:ss') > -1} disabled={value.readyOnly ? true : disabled} />
                break;

            case 'dateRange':
                component = <AntdDatePicker format={value.format} showTime={value.format.indexOf('HH:mm:ss') > -1} mode="range" disabled={value.readyOnly ? true : disabled} />
                break;

            case 'number':
                component = <InputNumber style={{ width: '100%' }} disabled={value.readyOnly ? true : disabled} />
                break;
            case 'textArea':
                component = <TextArea rows={value.rows} disabled={value.readyOnly ? true : disabled}  maxLength={value.maxLength?value.maxLength:200}/>
                break;
            case 'attachment':
                // component = <div style={{display:'flex'}}>
                //     {currentId?<Badge className="cus_badge_edit" count={1}>
                //         <div className="head-example">
                //             <FileReader
                //                 type="list"
                //                 count={1}
                //                 params={{ bizId: value.id, fileBizType: value.fileBizType }}
                //             />
                //         </div>
                //     </Badge>:''}
                //     <FileReader disabled={disabled} />
                // </div>
                component = <FileReader fileValue={detail[value.dataIndex]} disabled={value.readyOnly ? true : disabled}
                />
                break;
            case 'callSelect':
                let selectedData=[]
                if(detail[`${value.dataIndex}_showName`]){
                    let s = {}
                    s['id']= detail[`${value.dataIndex}`]
                    s[value.showName ? value.showName : value.columns[0].dataIndex] = detail[`${value.dataIndex}_showName`]
                    selectedData.push(s)
                }
                // 新增情况下是没有detail是
                component = <SearchSelect
                    selectedData={selectedData}
                    objParams={objParams}
                    paramsValue={this.emptyChang(value.dataIndex)}
                    // 废弃
                    // dataCode={detail ? detail[`${value.dataIndex}`] : undefined}
                    // dataName={detail ? detail[`${value.dataIndex}_showName`] : ''}
                    dataUrl={value.requestUrl}
                    // url={value.queryUrl}
                    showValue={value.showName ? value.showName : value.columns[0].dataIndex}
                    multiple={false} // 是否多选
                    // selectedData={mainDriver} // 选中值
                    columns={value.columns} // 表格展示列
                    onChange={(val, type) => this.onChange(val, type, value)} // 获取选中值
                    id="managerCar_1"
                    allowClear={true}
                    disabled={value.readyOnly ? true : disabled}
                />
                break;
            case 'fileImport':
                component = <Upload onRemove={(file) => this.onRemove(file)}
                    beforeUpload={(file) => this.beforeUpload(file, value.fileType)}
                    fileList={fileList}
                    accept={value.fileType}
                >
                    <Button>
                        <Icon type="upload" />{transferLanguage('Modal.field.envelope', language)}
                    </Button>
                </Upload >
                break;
            default:
                break;
        }
        return component
    }

    saveInfo = () => {
        const { form, dispatch, searchList, modalEmpty, formList } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            searchList({ payload: { wrapper: values } });
            modalEmpty();
        });
    };
    render() {
        const {
            form: { getFieldDecorator },
            visible,
            disabled,
            formList
        } = this.props;
        const { formItem } = this.state
        const _gutter = { md: 8, lg: 24, xl: 48 };
        const _col = { md: 8, sm: 24 };
        const _row = { md: 24 };
        return (
            <Row gutter={editGutter} >
                {this.convertFormFormat(formList).map((item, index) => {
                    return (
                        <Col span={item.span} key={index}>
                            {item.component}
                        </Col>
                    );
                })}
            </Row>
        )

    }
}