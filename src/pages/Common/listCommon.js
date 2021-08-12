import React , {Component,Fragment} from 'react'
import { Card,Form } from 'antd'
import ManageList from '@/components/ManageList';


@ManageList


@Form.create()
export default class listCommon extends Component{
    className = 'MoveTaskList';
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
  render(){
    return (
        <Fragment>
            <Card>
                <div style={{textAlign:'center'}}>页面待开发中</div>
            </Card>
        </Fragment>
    )
  }
}