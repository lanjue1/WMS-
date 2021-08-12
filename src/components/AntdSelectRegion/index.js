import React, { Component } from 'react';
import { Select, Cascader } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { isString } from 'util';

@connect(({ }) => ({}))
export default class AntdSelectRegion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: undefined,
            options: [],
            isFirst: true,
        };
    }

    componentDidMount() {
        this.setValue(this.props);
        const { data } = this.props;
        if (data && data.length > 0) {
            this.setState({ options: this.renderTreeNodes(data) });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { value, data } = nextProps;
        if (JSON.stringify(this.props.value) !== JSON.stringify(value)) {
            this.setValue(nextProps);
        }
        if (data && JSON.stringify(data) !== JSON.stringify(this.props.data)) {
            this.setState({ options: this.renderTreeNodes(data) });
        }
    }

    renderTreeNodes = data =>
        data.map(item => {
            const { id, partsItems, partsName1, partsName2, partsName3 } = item;
            if (partsItems) {
                return {
                    value: id,
                    label: `${partsName1}${partsName2 ? '/' + partsName2 : ''}${
                        partsName3 ? '/' + partsName3 : ''
                        }`,
                    children: partsItems.length > 0 ? this.renderTreeNodes(partsItems) : undefined,
                };
            } else {
                return {
                    value: id,
                    label: `${partsName1}${partsName2 ? '/' + partsName2 : ''}${
                        partsName3 ? '/' + partsName3 : ''
                        }`,
                };
            }
        });

    queryAllData = () => {
        const { dispatch, url } = this.props;
        dispatch({
            type: 'component/queryPartsOfferDict',
            payload: {
                params: {},
                url,
            },
            callback: data => {
                console.log('data??--1---????',data)
                if (!data) return;
                this.setState({ options: this.renderTreeNodes(data) });
            },
        });
    };

    isRateQueryData = () => {
        const { data } = this.props;
        if (data.length > 0) {
            this.setState({ options: this.renderTreeNodes(data) });
        }
    };

    setValue = props => {
        const { value, isParent, split, filter, data, isRate, getFirstValue } = props;
        const { options } = this.state;
        let newData = [];
        if (options.length > 0) return;
        if (value && isString(value)) {
            let data = value.split(split);
            if (isParent) {
                if (!filter) {
                    data = ['', ...data];
                }
                newData = data.filter((_, index) => index !== 0 && index !== data.length - 1);
                if (!getFirstValue) {
                    this.onChange(newData, null);
                }

                this.setState({
                    selected: newData,
                });
                if (!isRate) {
                    this.queryRegion(data.length - 3, data);
                }
            } else {
                if (!filter) {
                    data = ['', ...data];
                } else {
                    // 司机管理 后续需要后台加上
                    data = ['44857702471028736', ...data];
                }
                newData = data.filter((_, index) => index !== 0);
                if (!getFirstValue) {
                    this.onChange(newData, null);
                }

                this.setState({ selected: newData });
                if (!isRate) {
                    this.queryRegion(data.length - 2, data);
                }
            }
        } else {
            this.setState({ selected: value });
        }
    };

    queryRegion = (index, selectedData) => {
        const { label, isParent } = this.props;
        this.queryById({
            id: selectedData[index],
            callback: data => {
                const length = isParent ? 3 : 2;
                if (index === selectedData.length - length) {
                    const newOptions = data.map(item => {
                        return {
                            value: item.id,
                            label: item[label],
                            isLeaf: item.childNumber !== undefined && item.childNumber === 0 ? true : false,
                        };
                    });
                    this.setState({
                        options: newOptions,
                    });
                } else {
                    const targetOptions = data.map(item => {
                        if (item.id === selectedData[index + 1]) {
                            return {
                                value: item.id,
                                label: item[label],
                                isLeaf: item.childNumber !== undefined && item.childNumber === 0 ? true : false,
                                children: this.state.options,
                            };
                        } else {
                            return {
                                value: item.id,
                                label: item[label],
                                isLeaf: item.childNumber !== undefined && item.childNumber === 0 ? true : false,
                            };
                        }
                    });
                    this.setState({
                        options: targetOptions,
                    });
                }
                if (--index >= 0) {
                    this.queryRegion(index, selectedData);
                }
            },
        });
    };

    onFocus = () => {
        const { dispatch, url, label, filter, isRate } = this.props;
        const { options } = this.state;
        if (options.length > 0) return;
        this.queryById({
            id: '',
            callback: data => {
                if (!data) return;
                this.firstId = data[0].id;
                if (filter) {
                    this.queryById({
                        id: data[0].id,
                        callback: data2 => {
                            if (!data2) return;
                            this.setState({
                                options: data2.map(item => {
                                    return {
                                        value: item.id,
                                        label: item[label],
                                        isLeaf: item.childNumber !== undefined && item.childNumber === 0 ? true : false,
                                    };
                                }),
                            });
                        },
                    });
                } else {
                    this.setState({
                        options: data.map(item => {
                            return {
                                value: item.id,
                                label: item[label],
                                isLeaf: item.childNumber !== undefined && item.childNumber === 0 ? true : false,
                            };
                        }),
                    });
                }
            },
        });
    };

    /**
     * 查询options 接口
     */
    queryById = ({ id, callback } = {}) => {
        const { dispatch, url, paramsLabel, isRate } = this.props;
        const params = isRate ? {} : { [paramsLabel]: id };
        dispatch({
            type: 'common/selectReginList',
            payload: {
                params,
                url,
            },
            callback: data => {
                console.log('data??--2---????',data)

                if (!data) return;
                callback(data);
            },
        });
    };

    /**
     * 选中加载数据
     */
    loadData = selectedOptions => {
        const { dispatch, label, isRate } = this.props;
        if (isRate) return;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        this.queryById({
            id: targetOption.value,
            callback: data => {
                if (!data) return;
                targetOption.loading = false;
                if (data.length === 0) {
                } else {
                    targetOption.children = data.map(item => {
                        return {
                            value: item.id,
                            label: item[label],
                            isLeaf: item.childNumber !== undefined && item.childNumber === 0 ? true : false,
                        };
                    });
                }
                this.setState({
                    options: [...this.state.options],
                });
            },
        });
    };

    triggerChange = value => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
    };
    onPopupVisibleChange = value => {
        const { isRate } = this.props;
        const { isFirst } = this.state;
        if (!value) this.setState({ isFirst: true });
        if (isFirst && isRate && value) {
            this.queryAllData();
            this.setState({ isFirst: false });
            return;
        }
    };
    /**
     * 值改变
     */
    onChange = keys => {
        this.setState({ selected: keys });
        this.triggerChange(keys);
    };

    filter = (inputValue, path) => {
        return path.some(option => {
            if (option.children) {
                return false;
            }
            return option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
        });
    };

    renderSearchData = (inputValue, path) => {
        return path.map((item, index) => {
            if (item.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) {
                return (
                    <span key={index} className="ant-cascader-menu-item-keyword">
                        {item.label}
                    </span>
                );
            }
            return `${item.label} => `;
        });
    };

    render() {
        const { isOpen, selected, options } = this.state;
        const { showSplit, isRate, disabled, cusValue } = this.props;
        return (
            <Cascader
                onFocus={this.onFocus}
                allowClear={true}
                options={options}
                loadData={!isRate ? this.loadData : null}
                onPopupVisibleChange={value => {
                    this.onPopupVisibleChange(value);
                }}
                disabled={disabled}
                value={cusValue || selected}
                onChange={this.onChange}
                showSearch={
                    isRate
                        ? { filter: this.filter, render: this.renderSearchData, matchInputWidth: false }
                        : false
                }
                displayRender={label => {
                    return isRate
                        ? label.length > 0
                            ? label[label.length - 1]
                            : label.join(' => ')
                        : label.join(' / ');
                }}
                placeholder={formatMessage({ id: 'form.select.placeholder' })}
                changeOnSelect
            />
        );
    }
}
