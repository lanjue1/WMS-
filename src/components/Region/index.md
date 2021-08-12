注意：回显 selected格式 "0/1/2/3"

---
  static propTypes = {
    url: PropTypes.string,
    label: PropTypes.string,
    length: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    url: 'selectOrgById',
    label: 'name',
    length: 0,
    selected: [],
    onChange: () => {}, // 值改变
  };
---

级联选中框

````jsx
import Region from '@/components/Region';

onRegionChange = (keys,values) => {
    this.setState({
        selected: keys,
    });
};

ReactDOM.render(
  <Region
    url="selectOrgById"
    label="name"
    length={3}
    selected={this.state.selected}
    onChange={this.onRegionChange}
  />
, mountNode);
````
