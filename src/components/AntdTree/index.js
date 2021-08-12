import React, { Component } from 'react';
import { Tree, Button } from 'antd';
import { connect } from 'dva';
import { isArray } from 'util';
const { TreeNode } = Tree;
@connect(({ common }) => ({
  menuList: common.menuList,
  selectedMenuList: common.selectedMenuList,
}))
export default class AntdTree extends Component {
  state = {
    expandedKeys: [],
    autoExpandParent: false,
    checkedKeys: [],
  };

  componentDidMount() {
    this.queryData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.detailId !== this.props.detailId) {
      nextProps.detailId &&
        this.querySelectData({
          id: nextProps.detailId,
          callback: data => {
            if (!data) return;
            const selectedkeys = data.map(v => v.id);
            const parentIds = data.filter(v => v.parentId != 0).map(v => v.parentId);
            const checkedKeys = selectedkeys.filter(item => !parentIds.some(ele => ele === item));
            if (nextProps.onCheck) nextProps.onCheck(data.map(v => v.id));
            this.setState({
              checkedKeys,
              expandedKeys: checkedKeys,
            });
          },
        });
    }
  }

  querySelectData = ({ id, callback }) => {
    const { dispatch, url } = this.props;
    dispatch({
      type: 'common/selectSelectedMenuList',
      payload: { params: { id }, url },
      callback,
    });
  };

  queryData = (params = {}, callback = () => {}) => {
    const { dispatch, dataUrl } = this.props;
    dispatch({
      type: 'common/selectMenuList',
      payload: { params: { ...params }, url: dataUrl },
      callback,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = (checkedKeys, nodes) => {
    const { onCheck } = this.props;
    if (onCheck) onCheck([...checkedKeys, ...nodes.halfCheckedKeys]);
    this.setState({ checkedKeys });
  };

  editFilter = (filterId, menuId) => {
    const { editFilter } = this.props;
    if (editFilter) editFilter(filterId, menuId);
  };

  renderTreeNodes = data => {
    const { detailId } = this.props;
    const newDate = isArray(data) ? data : data.menuBODetail;
    return newDate.map(item => {
      if (item.menuBODetail) {
        return (
          <TreeNode
            title={
              <span>
                {item.name}
                {item.type === 'ELEMENT' && detailId && (
                  <Button
                    size="small"
                    type="primary"
                    style={{ marginLeft: 20 }}
                    onClick={this.editFilter.bind(this, item.id, data.id)}
                  >
                    编辑过滤
                  </Button>
                )}
              </span>
            }
            key={item.id}
            dataRef={item}
          >
            {this.renderTreeNodes(item)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} />;
    });
  };

  render() {
    const { menuList } = this.props;
    const { checkedKeys, expandedKeys, autoExpandParent } = this.state;
    return (
      <Tree
        checkable
        onExpand={this.onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={checkedKeys}
        
      >
        {this.renderTreeNodes(menuList)}
      </Tree>
    );
  }
}
