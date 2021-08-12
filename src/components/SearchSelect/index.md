---
  static propTypes = {
    url: PropTypes.string,
    dataUrl: PropTypes.string,
    selectedData: PropTypes.array,
    multiple: PropTypes.bool,
    columns: PropTypes.array,
    showValue: PropTypes.string,
    scrollX: PropTypes.number,
    scrollY: PropTypes.number,
    onlyRead: PropTypes.bool,
    allowClear: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    url: '', // 选中值 id 查询数据url
    dataUrl: '', // 表格数据查询 url
    selectedData: [], // 选中值
    multiple: true, // 是否多选
    columns: [], // 表格展示列
    showValue: 'name', // 选中展示列
    scrollX: 500, // 表格x
    scrollY: 240, // 表格y
    onlyRead: false, // 是否查看模式
    allowClear: false, // 是否清除
    onChange: () => {},  // 值改变
  };
---

查找框

````jsx
import SearchSelect from '@/components/SearchSelect';

onChange = values => {
    this.setState({
        drivers: values,
    });
};

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        width: '33.3%',
    },
    {
        title: '工号',
        dataIndex: 'workerNo',
        width: '33.3%',
    },
    {
        title: '电话',
        dataIndex: 'phoneNumOne',
    },
];

ReactDOM.render(
  <SearchSelect
    dataUrl="tms/tms-driver/selectList"
    selectedData={drivers} 
    columns={columns} 
    onChange={this.onChange} 
  />
, mountNode);
````
