import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Form, Input, Select, Row, Col, Tree, Button, Icon, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ManageList from '@/components/ManageList';
import styles from './index.less';
import RuleMenuInfo from './RuleMenuInfo';
import RuleContentInfo from './RuleContentInfo';
import {
  CodeOutlined, ConsoleSqlOutlined
} from '@ant-design/icons';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode, DirectoryTree } = Tree;
const confirm = Modal.confirm;

@ManageList
@connect(({ businessRules, loading }) => ({
  businessRules,
  loading: loading.effects['businessRules/ruleMenuList'],
}))
@Form.create()
export default class RulesList extends Component {
  state = {
    handleType: 'add',
    globalListData: [],
    visibleRule: false,
    checkId: '',
    expandedKeys: [],
    tempList: [],
    menuType: 'MENU',
    ruleType: '',
    selectedKeys: [],
    isRuleEdit: true, //编辑规则模式
    isMenuEdit: true,
  };
  className = 'BusinessRulesList';

  componentDidMount() {
    this.getRuleMenuList();
  }

  getRuleMenuList = (params = {}, type) => {
    const { dispatch } = this.props;
    const { globalListData } = this.state;
    const { id } = params;
    if (id) params.id = id;
    // params.pageSize = 100;
    dispatch({
      type: 'businessRules/ruleMenuList',
      payload: params,
      callback: res => {
        //添加标识，表示有子数据
        res.map(v => {
          if (v.childQty > 0) v.children = [{ menuName: '-', id: v + '_' + v }];
        });
        if (type === 'child') {
          this.formateData(res, globalListData, id);
        } else {
          this.setState({
            globalListData: res,
            expandedKeys: res.length === 1 && res[0].childQty > 0 ? [res[0].id] : [],
          });
          if (res.length === 1) {
            this.getRuleMenuList({ id: res[0].id }, 'child');
          }
        }
      },
    });
  };
  /*
    层级结构：
    */
  formateData = (dataChild, data, id) => {
    data.forEach(v => {
      if (dataChild.length > 0 && v.id == id) {
        v.children = dataChild;
        this.setState({ tempList: data });
      } else if (v.children) {
        this.formateData(dataChild, v.children, id);
      }
    });
  };
  //展开收起：
  onExpandTree = (expandedKey, { expanded: bool, node }) => {

    const { expandedKeys } = this.state;
    const id = node.props.eventKey;
    let arr = expandedKeys;
    if (bool) {
      arr = expandedKeys.filter(v => v !== id);
      arr.push(id);
      this.getRuleMenuList({ id }, 'child');
    } else {
      arr = expandedKeys.filter(v => v !== id);
      arr = arr.filter(v => this.recursion(node).indexOf(v) === -1)
    }

    this.setState({
      expandedKeys: arr,
    });
  };

  recursion = (children) => {
    let childrenArray = []
    if (children.props.children) {
      childrenArray = children.props.children.map(item => {
        if (item.props.children) {
          childrenArray.concat(this.recursion(item))
        }
        return item.key
      })
    }
    return childrenArray
  }

  setExpandedKeys = id => {
    const { expandedKeys } = this.state;
    expandedKeys.push(id);
    let arr = expandedKeys.filter(function (element, index, self) {
      return self.indexOf(element) === index;
    });
    this.setState({
      expandedKeys: arr,
    });
  };

  //选中树节点
  onSelectTree = (selectedKeys, info) => {
    this.setState({ visibleRule: false }, () => {
      const {
        selected,
        node: {
          props: { dataRef },
        },
      } = info;
      const { dispatch } = this.props;
      this.setState({
        visibleRule: true,
        checkId: dataRef.id,
        menuType: dataRef.type,
        selectedKeys: selectedKeys,
      });
      let params = {};
      params.id = dataRef.id;
      if (selected) {
        let editUrl = 'businessRules/ruleMenuConDetails';
        if (dataRef.type == 'MENU') {
          editUrl = 'businessRules/ruleMenuDetails';
          this.setState({
            isMenuEdit: true,
          });
        } else {
          this.setState({
            isRuleEdit: true,
          });
        }
        dispatch({
          type: editUrl,
          payload: params,
          callback: res => {
            this.setState({
              ruleType: res.type,
            });
            if (dataRef.type == 'MENU') {
              this.setState({
                handleType: 'editMenu',
              });
            } else {
              this.setState({
                handleType: 'editRule',
              });
            }
          },
        });
      }

    })

  };

  delDataFormat = (data, id) => {
    if (!data) data = this.state.globalListData;
    data.forEach((v, index) => {
      if (data.length > 0 && v.id == id) {
        data.splice(index, 1);
        this.setState({ tempList: data });
        return;
      } else if (v.children) {
        this.delDataFormat(v.children, id);
      }
    });
  };

  handleStateChange = (options = []) => {
    options.map(item => {
      this.setState(item);
    });
  };

  renderTreeNodes = data => {
    const { selectedKeys } = this.state;
    const title = val => (
      <span className={styles.treeTitle}>
        <span
          className={selectedKeys[0] !== val.id && val.status == 'RELEASE' ? styles.isRelease : ''}
        >
          {val.menuName}
        </span>
      </span>
    );
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={title(item)} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children, 'child')}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          icon={({ selected }) => {
            return item.type == 'RULE'
              ?
              (
                <CodeOutlined />
              ) : item.type == 'SOURCE' ?
                (<ConsoleSqlOutlined />)
                : <Icon type='folder' />
            /*  <Icon
    type={
      item.type == 'RULE'
        ? 'file-text'
        : item.type == 'SOURCE'
          ? 'file-exclamation'
          : 'folder'
    }
  /> */
          }}
          title={title(item)}
          key={item.id}
          dataRef={item}
          isLeaf={true}
        />
      );
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {
      visibleRule,
      globalListData,
      checkId,
      expandedKeys,
      handleType,
      menuType,
      ruleType,
      selectedKeys,
      isRuleEdit,
      isMenuEdit,
    } = this.state;
    const details = {};

    const InfoConParams = {
      id: checkId,
      ruleType,
      handleType,
      getRuleMenuList: this.getRuleMenuList,
      setExpandedKeys: this.setExpandedKeys,
      handleChildStateChange: this.handleStateChange,
      delDataFormat: this.delDataFormat,
      isRuleEdit,
    };
    const InfoMenuParams = {
      id: checkId,
      handleType,
      getRuleMenuList: this.getRuleMenuList,
      setExpandedKeys: this.setExpandedKeys,
      handleChildStateChange: this.handleStateChange,
      delDataFormat: this.delDataFormat,
      isMenuEdit,
    };
    return (
      <Fragment>
        <Row gutter={24}>
          <Col className="gutter-row" span={7}>
            <div className={styles.gutterBox}>
              {globalListData.length ? (
                <DirectoryTree
                  // showLine
                  // defaultExpandedKeys={expandedKeys}
                  onSelect={this.onSelectTree}
                  className="busRules_treeBox"
                  blockNode={true}
                  onExpand={this.onExpandTree}
                  expandedKeys={expandedKeys}
                  selectedKeys={selectedKeys}
                >
                  {this.renderTreeNodes(globalListData)}
                </DirectoryTree>
              ) : (
                  ''
                )}
            </div>
          </Col>
          <Col className="gutter-row" span={17}>
            {visibleRule &&
              (menuType == 'MENU' ? (
                <RuleMenuInfo {...InfoMenuParams} visible={visibleRule} />
              ) : handleType == 'editRule' ? (
                <RuleContentInfo {...InfoConParams} visible={visibleRule} />
              ) : (
                    <RuleContentInfo {...InfoConParams} visible={visibleRule} />
                  ))}
          </Col>
        </Row>
      </Fragment>
    );
  }
}
