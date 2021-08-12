import React, { PureComponent, Fragment, Component } from 'react';
import { Table, Alert, Button, Icon } from 'antd';
import Media from 'react-media';
import { Resizable } from 'react-resizable';
import { _PageSize } from '@/utils/constans';
import Setting from '@/components/FieldSetting';
import { getPageSize } from '@/utils/common';
import styles from './index.less';
import { transferLanguage } from '@/utils/utils';
import { connect } from 'dva';

const user = JSON.parse(localStorage.getItem('user'));
function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

const ResizeableTitle = props => {
  const { onResize, width,onClick, ...restProps } = props;
  let resizing = false;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable width={width} height={0} onResize={onResize}
      onResizeStart={() => {
        resizing = true;
      }}
      onResizeStop={() => {
        resizing = true;
        setTimeout(() => {
          resizing = false;
        }, 100);

      }}>
      <th {...restProps} onClick={(...args) => {
        if (!resizing) {
          onClick(...args);
        }
      }} />
    </Resizable>
  );
};
@connect(({ i18n, common }) => ({
  language: i18n.language,
  common
}))
class StandardTable extends Component {
  constructor(props) {
    super(props);
    const { columns, code, fixedColumn } = props;
    const needTotalList = initTotalList(columns);
    this.tableColumnWidth = 80;
    this.scrollTop = 0;
    this.pageSize = 50;
    this.pageIndex = 1;
    this.distance = 5;
    this.nomore = false;
    this.localColumn =
      user && user.loginName
        ? columns
        : '';
    this.state = {
      selectedRowKeys: [],
      needTotalList,
      clientHeight: document.body.clientHeight,
      formHeight: 43,
      pageHeight: 32,
      newColumns: code ? this.resetColumns() : columns,
      visible: false,
      newData: [],
      pageHasChange: false,
      _defaultPageSize: 50,
    };
  }

  resetColumns = () => {
    const { columns, isMobile, code, tableColumnWidth } = this.props;
    return columns.map((item, index) => {
      const sorter = { sorter: code ? false : false };
      let newColumn = { ...sorter, ...item };
      const width = { width: this.tableColumnWidth };
      const fixedWidth = { width: isMobile ? 'auto' : this.tableColumnWidth };
      const render = text => <span title={text}> {text}</span>;
      if (!item.width) {
        if (item.fixed) {
          newColumn = { ...fixedWidth, ...newColumn };
        } else {
          if (index !== columns.length - 1) {
            newColumn = { ...width, ...newColumn };
          }
        }
      }
      if (!item.render) {
        newColumn = { ...render, ...newColumn };
      }
      return newColumn;
    });
  };

  resize = () => {
    const { className, pagination } = this.props;
    this.setState({
      clientHeight: document.body.clientHeight,
    });
    this.getHeight({ name: 'ant-form', key: 'formHeight' });
    pagination && this.getHeight({ name: 'ant-table-pagination', key: 'pageHeight' });
  };

  getHeight = ({ name, key }) => {
    const { className } = this.props;
    const ele = document.querySelector(`.${className} .${name}`);
    ele && this.setState({ [key]: ele.clientHeight });
  };

  /**
   * type 0 上拉 1 下拉
   */
  loadPageData = (data, first, last, type) => {
    const { newData } = this.state;
    let dataSource = data.list/*.filter((_, index) => index >= first && index < last) */;
    if (dataSource.length < this.pageSize) {
      this.nomore = true;
      if (dataSource.length === 0) {
        return;
      }
      const lastData = [
        ...newData.filter((_, index) => {
          return index >= dataSource.length && index < this.pageSize;
        }),
        ...dataSource,
      ];
    }

    this.setState({
      newData: [...newData, ...dataSource],
    });
  };

  LazyLoadRow = props => {
    if (props.children[0].props.record.id) {
      return <tr {...props} />;
    } else {
      return <tr style={{ height: 39 }} />;
    }
  };

  nextPageData = e => {
    const { clientHeight, scrollHeight, scrollTop } = e.target;

    const isBottom = scrollHeight - clientHeight - scrollTop;
    const { data, className } = this.props;
    const tableEle = document.querySelector(`.${className} .ant-table-body`);
    if (scrollTop > this.scrollTop) {
      if (isBottom < this.distance) {
        if (scrollTop === scrollHeight - clientHeight - this.distance) {
          return;
        }
        if (this.nomore) return;
        this.pageIndex += 1;
        this.loadPageData(
          data,
          (this.pageIndex - 1) * this.pageSize,
          this.pageIndex * this.pageSize,
          0
        );
      }
    }
  };

  componentDidMount() {
    const { className, code, expandForm, canInput, onExpandRow, data, defaultPageSize, fixedColumn } = this.props;
    const localdata = this.localColumn;
    this.setState({ _defaultPageSize: defaultPageSize || _PageSize }, () => {
      const { _defaultPageSize } = this.state
      localStorage.setItem(`${className}_defaultPagesize`, _defaultPageSize)
    })
    if (localdata) {
      // const fixedIndex = JSON.parse(
      //   localStorage.getItem(`${code}_${user.loginName}_freezingColumn`)
      // );
      const fixedIndex = fixedColumn;
      this.columnSort(localdata, fixedColumn);
    }
    if (!className) return;
    if (expandForm !== undefined && !onExpandRow && !canInput && code) {
      const tableEle = document.querySelector(`.${className} .ant-table-body`);
      tableEle.addEventListener('scroll', this.nextPageData);
    }
    if (!onExpandRow && !canInput && className && data.list && data.list.length > 0) {
      this.firstRenderData(this.props);
    }
    window.addEventListener('resize', this.resize);
    setTimeout(() => {
      this.getHeight({ name: 'ant-form', key: 'formHeight' });
      this.setState({
        clientHeight: document.body.clientHeight,
      });
    }, 20);
  }

  componentWillUnmount() {
    const { className, expandForm } = this.props;
    window.removeEventListener('resize', this.resize);
    if (expandForm !== undefined) {
      const tableEle = document.querySelector(`.${className} .ant-table-body`);
      // tableEle.removeEventListener('scroll', this.nextPageData);
    }
  }

  firstRenderData = props => {
    const { className, data } = props;

    this.nomore = false;
    this.pageIndex = 1;
    const tableEle = document.querySelector(`.${className} .ant-table-body`);
    const page = Math.trunc(data.list.length / this.pageSize);
    const lastPage = data.list.length % this.pageSize;
    this.loadPageData(data, (this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize);
  };

  componentWillReceiveProps(nextProps) {
    const {
      className,
      expandForm,
      columns,
      fixedIndex,
      fixedColumn,
      code,
      data,
      pagination,
      loading,
      selectedRows,
      onExpandRow,
      canInput,
    } = nextProps;
    if (
      !onExpandRow &&
      !canInput &&
      className &&
      data.list &&
      JSON.stringify(data) !== JSON.stringify(this.props.data)
    ) {
      if (data.list.length > 0) {
        this.setState(
          {
            newData: [],
          },
          () => {
            this.firstRenderData(nextProps);
          }
        );
      } else {
        this.setState({
          newData: [],
        });
      }
    }

    if (expandForm !== this.props.expandForm) {
      setTimeout(() => {
        this.getHeight({ name: 'ant-form', key: 'formHeight' });
      }, 20);
    }
    if (pagination && !loading && loading !== this.props.loading) {
      this.getHeight({ name: 'ant-table-pagination', key: 'pageHeight' });
    }
    if (JSON.stringify(columns) !== JSON.stringify(this.props.columns)) {
      this.setState({ newColumns: code ? this.resetColumns() : columns }, () => {
        // const datas = columns;
        const datas =
          user && user.loginName
            ? columns
            : '';
        if (datas) {
          // const fixedIndex = JSON.parse(
          //   localStorage.getItem(`${code}_${user.loginName}_freezingColumn`)
          // );
          this.columnSort(datas, fixedIndex);
        }
      });

    }
    if (selectedRows && selectedRows.length === 0) {
      const needTotalList = initTotalList(columns);
      this.setState({ selectedRowKeys: [], needTotalList });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { onPaginationChange } = this.props;
    const { formValues } = this.state;
    // this.setState({ newData: [] });
    if (pagination.pageSize) {
      localStorage.setItem(`${user.loginName}_pageSize`, pagination.pageSize);
      this.setState({
        pageHasChange: true
      })
    }

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }
    if (onPaginationChange && !sorter.field) {
      onPaginationChange(params);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  onSelect = (record, selected, selectedRows) => {
    const { onSelect } = this.props;
    if (!onSelect) return;

    onSelect(record, selected, selectedRows);
  };

  onSelectAll = (record, selected, selectedRows) => {
    const { onSelectAll, onSelectRow, data, disabledSelectedRows } = this.props;
    let newData = [];
    if (record) {
      if (disabledSelectedRows) {
        const { code, value } = disabledSelectedRows;
        newData = data.list.filter(item => value.includes(item[code[0]] || item[code[1]]));
      } else {
        newData = data.list;
      }
    }
    if (!onSelectAll) {
      this.handleRowSelectChange(newData.map(v => v.id), newData);
      return;
    }
    onSelectAll(record, selected, selectedRows);
  };


  onExpandRow = (expanded, record) => {
    const { onExpandRow } = this.props;
    onExpandRow(expanded, record);
  };

  setVisible = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  columnSort = (cols, fixedIndex) => {
    const { isMobile, columns, code } = this.props;
    let data = [];

    cols.forEach((item, index) => {
      columns.forEach(cloumn => {
        const selected = { hidden: item.hidden };
        let newCol = { sorter: code ? false : false, ...cloumn };
        const width = { width: this.tableColumnWidth };
        const fixedWidth = { width: isMobile ? 'auto' : this.tableColumnWidth };
        const render = text => <span title={text}> {text}</span>;
        if (!cloumn.width) {
          if (cloumn.fixed) {
            newCol = { ...fixedWidth, ...newCol };
          } else {
            newCol = { ...width, ...newCol };
          }
        }
        if (!cloumn.render) {
          newCol = { ...render, ...newCol };
        }
        //固定列
        if (newCol.dataIndex === item.dataIndex) {
          if (index < fixedIndex) {
            data.push({ fixed: isMobile ? false : true, ...newCol, ...selected });
          } else {
            data.push({ ...newCol, ...selected });
          }
        }
      });
    });
    const newColumnsLength = data.filter(v => !v.hidden).length;

    let count = 0;
    data = data.map(item => {
      if (item.hidden) {
        return item;
      } else {
        count += 1;
        if (count === newColumnsLength) {
          const { width, ...rest } = item;
          return rest;
        } else {
          return item;
        }
      }
    });
    this.setState({ newColumns: data });
  };

  //导出事件
  exportFn = () => {
    const { dispatch, exportParams } = this.props;
    dispatch({
      type: 'common/globalExportFn',
      payload: exportParams,
    });
  }

  handleOk = (newColumns, fixedIndex) => {
    const { columns, sortOk } = this.props;
    sortOk(columns, fixedIndex)
    this.columnSort(newColumns, fixedIndex);
  };

  handleResize = index => (e, { size }) => {
    this.setState(({ newColumns }) => {
      const nextColumns = [...newColumns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { newColumns: nextColumns };
    });
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   for (const key in nextProps) {
  //     if (JSON.stringify(this.props[key]) !== JSON.stringify(nextProps[key])) {
  //       return true;
  //     }
  //   }
  //   for (const key in nextState) {
  //     if (JSON.stringify(this.state[key]) !== JSON.stringify(nextState[key])) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  components = {
    header: {
      cell: ResizeableTitle,
    },
    // body: {
    //   row: this.LazyLoadRow,
    // },
  };

  render() {
    const {
      selectedRowKeys,
      newColumns,
      needTotalList,
      clientHeight,
      formHeight,
      pageHeight,
      visible,
      newData,
      pageHasChange,
      _defaultPageSize,
    } = this.state;
    const {
      data = {},
      scrollX,
      expandForm,
      showAllCount = false,
      rowKey,
      disabledRowSelected = false,
      selectedRows = [],
      simple,
      scrollY,
      className,
      id,
      columns,
      fixedColumn,
      code,
      isMobile,
      getCheckboxProps,
      components,
      canInput,
      onExpandRow,
      bottomBtnHeight,
      rowType,
      hideDefaultSelections,
      style,
      pageSizeOptions,
      language,
      exportBtn,
      exportButtonList,
      configJsonTable,
      ...rest
    } = this.props;
    const { list = [], total, pagination, pagination: { pageSize, ...restPagination } = {} } = data;
    const _bottomBtnHeight = bottomBtnHeight === true ? 42 : bottomBtnHeight ? bottomBtnHeight : 0;
    let scroll = {
      x: code
        ? newColumns
          .filter(v => v.width)
          .map(v => v.width)
          .reduce((a, b) => {
            return a + b;
          }, 0) +
        this.tableColumnWidth +
        30
        : scrollX || 1300,
    };
    if (expandForm !== undefined) {
      let Y = clientHeight - (178 + pageHeight + formHeight) + _bottomBtnHeight;
      if (data.list && data.list.length === 0 || !data.list) {
        Y = Y + 43 - 168;
      }
      scroll = { ...scroll, y: Y };
      // const ele = document.querySelector(`.${className} .ant-table-body`);
      let eleArr = document.getElementsByClassName("ant-table-body");
      const eleTemp = document.querySelector(`.${className} .ant-table-placeholder`);
      if (eleArr && eleArr.length) {
        for (var i = 0; i < eleArr.length; i++) {
          eleArr[i].style.height = `${Y}px`;
        }
        if (eleTemp && list.length === 0) {
          eleTemp.style.top = `-${Y}px`;
        }
      }
    }
    if (scrollY) {
      scroll = { ...scroll, y: scrollY };
    }
    let _total = transferLanguage('Common.field.total', this.props.language)

    const paginationProps = {
      showQuickJumper: true,
      simple: simple || false,
      showLessItems: true,
      showSizeChanger: true,
      pageSize: !pageHasChange && _defaultPageSize ? _defaultPageSize : getPageSize() || pageSize,
      pageSizeOptions: pageSizeOptions || ['50', '100', '300', '500'],
      total,
      showTotal: total => {
        return `${_total} ${total} `
      },
      ...restPagination,
    };

    const rowSelection = {
      selectedRowKeys: selectedRows ? selectedRows.map(v => v.id) : selectedRowKeys,
      onChange: this.handleRowSelectChange,
      onSelect: this.onSelect,
      key: record => record.id,
      columnWidth: 35,
      onSelectAll: this.onSelectAll,
      getCheckboxProps: record => ({
        disabled: getCheckboxProps ? getCheckboxProps(record) : false,
      }),
      type: rowType === 'radio' ? 'radio' : 'checkbox',
    };
    if (this.props.hideCheckAll) {
      rowSelection.columnTitle = ' '
    }
    const nextColumns = this.state.newColumns.map((col, index) => ({

      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));
    return (
      <div className={className} style={{ width: id ? '100%' : 'auto' }}>
        <div className={styles.standardTable}>
          <Table
            onExpand={this.onExpandRow}
            rowKey={record => record.id}
            rowSelection={disabledRowSelected ? undefined : rowSelection}
            // dataSource={onExpandRow || canInput || !className ? list : newData}
            dataSource={list}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            scroll={scroll}
            components={{ ...this.components, ...components }}
            columns={nextColumns.filter(v => !v.hidden)}
            {...rest}
          />
          <Setting
            handleOk={this.handleOk}
            visible={visible}
            isMobile={isMobile}
            setVisible={this.setVisible}
            dataSource={newColumns}
            code={code}
            configJsonTable={configJsonTable}
            oldDataSource={code ? this.resetColumns() : columns}
          />
          {code && (
            <div className={styles.setting} onClick={this.setVisible}>
              <Icon type="setting" />
            </div>
          )}
          {exportButtonList}
          {/* <Button hidden={!exportBtn} style={{ position: 'absolute', bottom: '0px' }} onClick={this.exportFn} >export</Button> */}
        </div>
      </div>
    );
  }
}

export default props => (
  <Media query="(max-width: 599px)">
    {isMobile => <StandardTable {...props} isMobile={isMobile} />}
  </Media>
);
